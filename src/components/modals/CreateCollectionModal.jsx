// src/components/modals/CreateCollectionModal.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { collectionsService } from '../../services/firebase';
import { PokemonAPI } from '../../services/pokemonAPI';
import toast from 'react-hot-toast';

function CreateCollectionModal({ isOpen, onClose, onSubmit, isLoading = false }) {
    const { currentUser } = useAuth();

    // ✅ STATI PER IL WIZARD
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [availableSets, setAvailableSets] = useState([]);
    const [loadingSets, setLoadingSets] = useState(false);

    // ✅ FORM DATA - Usa il tuo pattern esistente
    const initialFormState = {
        name: '',
        description: '',
        gameId: 'pokemon',
        language: 'it', // Default italiano
        type: 'base', // 'base' o 'custom'
        selectedSet: null,
        isComplete: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const supportedLanguages = PokemonAPI.getSupportedLanguages();

    // Reset form quando il modal si chiude - Usa il tuo pattern
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setStep(1);
            setAvailableSets([]);
        }
    }, [isOpen]);

    // ✅ CARICA SET QUANDO SI SCEGLIE COLLEZIONE BASE
    useEffect(() => {
        if (isOpen && formData.type === 'base' && step === 2) {
            loadAvailableSets();
        }
    }, [isOpen, formData.type, step]);

    // ✅ CARICA SET DISPONIBILI
    const loadAvailableSets = async () => {
        setLoadingSets(true);
        try {
            const setsResponse = await PokemonAPI.getSetsByLanguage(formData.language);

            if (setsResponse.data) {
                // Ordina i set per data di rilascio (più recenti prima)
                const sortedSets = setsResponse.data
                    .filter(set => set.cardCount && set.cardCount.total > 0)
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

                setAvailableSets(sortedSets);
            }
        } catch (error) {
            console.error('❌ Error loading sets:', error);
            toast.error('Errore nel caricamento dei set Pokemon');
        } finally {
            setLoadingSets(false);
        }
    };

    // ✅ NAVIGATION FUNCTIONS
    const handleNextStep = () => {
        // Validazioni per ogni step
        if (step === 1) {
            if (!formData.name.trim()) {
                toast.error('Il nome della collezione è obbligatorio');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (formData.type === 'base' && !formData.selectedSet) {
                toast.error('Seleziona un set Pokemon');
                return;
            }
            setStep(3);
        }
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    // ✅ CREA COLLEZIONE - Integrato con il tuo collectionsService
    const handleCreateCollection = async () => {
        setLoading(true);

        try {
            if (formData.type === 'base') {
                await createBaseCollection();
            } else {
                // Collezioni personalizzate - futuro
                toast.info('Collezioni personalizzate disponibili presto!');
            }
        } catch (error) {
            console.error('❌ Error creating collection:', error);
            toast.error('Errore nella creazione della collezione');
        } finally {
            setLoading(false);
        }
    };

    // ✅ CREA COLLEZIONE BASE
    // Nel tuo CreateCollectionModal.jsx, modifica la funzione createBaseCollection:

    const createBaseCollection = async () => {
        try {
            // 1. Ottieni dettagli completi del set
            let setData = await collectionsService.getSetFromCache(formData.selectedSet.id);
            if (!setData) {
                const setResponse = await PokemonAPI.getSetsByLanguage(formData.language);
                setData = setResponse.data.find(s => s.id === formData.selectedSet.id);

                if (!setData) {
                    throw new Error('Set non trovato');
                }
            }

            // ✅ CARICA CARTE CON FALLBACK
            console.log('🔍 Loading cards for set:', formData.selectedSet.id);
            const cardsResponse = await PokemonAPI.getCardsBySet(
                formData.selectedSet.id,
                formData.language,
                1,
                500
            );

            // ✅ MANTIENI SOLO QUESTO:
            if (cardsResponse.isFallback) {
                const languageNames = {
                    'it': 'italiano',
                    'en': 'inglese',
                    'fr': 'francese',
                    'es': 'spagnolo',
                    'de': 'tedesco',
                    'ja': 'giapponese'
                };

                const originalLang = languageNames[cardsResponse.requestedLanguage] || cardsResponse.requestedLanguage;
                const fallbackLang = languageNames[cardsResponse.language] || cardsResponse.language;

                toast.success(
                    `📢 Il set "${formData.selectedSet.name}" non era disponibile in ${originalLang}.\n` +
                    `Caricato in ${fallbackLang} con ${cardsResponse.data.length} carte! 🌍`,
                    {
                        duration: 6000,
                        style: {
                            maxWidth: '500px',
                        }
                    }
                );
            }

            // ✅ PREPARA DATI COLLEZIONE CON LINGUA EFFETTIVA
            const collectionData = {
                name: formData.name,
                description: formData.description,
                gameId: formData.gameId,
                language: cardsResponse.language, // ✅ USA LINGUA EFFETTIVA
                requestedLanguage: formData.language, // ✅ SALVA LINGUA RICHIESTA
                ownerId: currentUser.uid,
                isFallback: cardsResponse.isFallback, // ✅ FLAG FALLBACK
                members: {
                    [currentUser.uid]: {
                        role: 'owner',
                        canEdit: true,
                        joinedAt: new Date()
                    }
                }
            };

            // ✅ CREA COLLEZIONE
            const result = await collectionsService.createBaseCollection(
                collectionData,
                setData,
                cardsResponse.data,
                formData.isComplete
            );

            if (result.success) {
                toast.success(`Collezione "${formData.name}" creata con successo! 🎉`);
                onSubmit?.();
                handleClose();
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('❌ Error creating base collection:', error);
            toast.error(`Errore: ${error.message}`);
        }
    };

    // ✅ CHIUDI MODALE - Reset completo
    const handleClose = () => {
        setFormData(initialFormState);
        setStep(1);
        setAvailableSets([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* ✅ HEADER CON PROGRESS */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-white text-xl font-semibold">Crea Nuova Collezione</h2>
                        <p className="text-white/60 text-sm mt-1">Passo {step} di 3</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-white/70 hover:text-white transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* ✅ PROGRESS BAR - Stesso stile delle tue card */}
                <div className="mb-8">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full transition-all duration-300 ${s <= step
                                    ? 'bg-gradient-to-r from-purple-500/60 to-pink-500/60'
                                    : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* ✅ STEP 1: INFORMAZIONI BASE */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">
                                Nome Collezione *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={loading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                                         focus:outline-none focus:border-white/30 transition-all
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="La mia collezione Pokemon"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">
                                Descrizione (Opzionale)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={loading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                                         focus:outline-none focus:border-white/30 transition-all resize-none
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Descrivi la tua collezione..."
                                rows="3"
                                maxLength={200}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Lingua
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    disabled={loading}
                                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                             rounded-lg px-4 py-3 text-white 
                                             focus:outline-none focus:border-white/30 transition-all
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             [&>option]:bg-gray-800 [&>option]:text-white"
                                >
                                    {Object.entries(supportedLanguages).map(([code, info]) => (
                                        <option key={code} value={code} className="bg-gray-800 text-white">
                                            {info.flag} {info.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Gioco
                                </label>
                                <select
                                    value={formData.gameId}
                                    onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                                    disabled={loading}
                                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                             rounded-lg px-4 py-3 text-white 
                                             focus:outline-none focus:border-white/30 transition-all
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             [&>option]:bg-gray-800 [&>option]:text-white"
                                >
                                    <option value="pokemon">Pokémon TCG</option>
                                    <option value="magic" disabled>Magic (Prossimamente)</option>
                                    <option value="yugioh" disabled>Yu-Gi-Oh (Prossimamente)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✅ STEP 2: TIPO COLLEZIONE */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white/70 text-sm mb-4">
                                Tipo di Collezione
                            </label>

                            <div className="space-y-3">
                                <label className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer 
                                                 transition-all backdrop-blur-xl border
                                                 ${formData.type === 'base'
                                        ? 'bg-purple-500/20 border-purple-400/50'
                                        : 'bg-white/[0.08] border-white/[0.12] hover:bg-white/10'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="base"
                                        checked={formData.type === 'base'}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-white">Collezione Base</div>
                                        <div className="text-sm text-white/60">
                                            Scegli un set specifico e inizia a collezionare tutte le sue carte
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 p-4 rounded-lg cursor-not-allowed 
                                               backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] opacity-50">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="custom"
                                        disabled
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-white">Collezione Personalizzata</div>
                                        <div className="text-sm text-white/60">
                                            Crea una collezione con carte specifiche (Prossimamente)
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* ✅ SELEZIONE SET per collezione base */}
                        {formData.type === 'base' && (
                            <div>
                                <label className="block text-white/70 text-sm mb-3">
                                    Seleziona Set Pokemon *
                                </label>

                                {loadingSets ? (
                                    <div className="text-center py-8 text-white/60">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto mb-2"></div>
                                        Caricamento set disponibili...
                                    </div>
                                ) : (
                                    <div className="max-h-64 overflow-y-auto space-y-2 backdrop-blur-xl bg-white/[0.04] 
                                                   border border-white/[0.08] rounded-lg p-3">
                                        {availableSets.map((set) => (
                                            <label
                                                key={set.id}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
                                                           transition-all ${formData.selectedSet?.id === set.id
                                                        ? 'bg-purple-500/20 border border-purple-500/50'
                                                        : 'bg-white/[0.08] hover:bg-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="selectedSet"
                                                    checked={formData.selectedSet?.id === set.id}
                                                    onChange={() => setFormData({ ...formData, selectedSet: set })}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-white text-sm truncate">
                                                        {set.name}
                                                    </div>
                                                    <div className="text-xs text-white/60">
                                                        {set.serie?.name || 'Serie sconosciuta'} • {set.cardCount?.total || 0} carte
                                                        {set.releaseDate && ` • ${set.releaseDate}`}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ✅ STEP 3: CONFIGURAZIONE FINALE */}
                {step === 3 && formData.type === 'base' && formData.selectedSet && (
                    <div className="space-y-6">
                        {/* Riepilogo */}
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-lg p-4">
                            <h3 className="font-medium text-white mb-3">Riepilogo Collezione</h3>
                            <div className="space-y-2 text-sm text-white/80">
                                <div><strong>Nome:</strong> {formData.name}</div>
                                <div><strong>Set:</strong> {formData.selectedSet.name}</div>
                                <div><strong>Carte totali:</strong> {formData.selectedSet.cardCount?.total || 0}</div>
                                <div><strong>Lingua:</strong> {supportedLanguages[formData.language]?.name}</div>
                            </div>
                        </div>

                        {/* Stato iniziale */}
                        <div>
                            <label className="block text-white/70 text-sm mb-4">
                                Stato Iniziale della Collezione
                            </label>

                            <div className="space-y-3">
                                <label className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer 
                                                 transition-all backdrop-blur-xl border
                                                 ${!formData.isComplete
                                        ? 'bg-blue-500/20 border-blue-400/50'
                                        : 'bg-white/[0.08] border-white/[0.12] hover:bg-white/10'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="isComplete"
                                        checked={!formData.isComplete}
                                        onChange={() => setFormData({ ...formData, isComplete: false })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-white">Collezione Vuota</div>
                                        <div className="text-sm text-white/60">
                                            Inizia con 0 carte possedute e aggiungile man mano
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer 
                                                 transition-all backdrop-blur-xl border
                                                 ${formData.isComplete
                                        ? 'bg-green-500/20 border-green-400/50'
                                        : 'bg-white/[0.08] border-white/[0.12] hover:bg-white/10'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="isComplete"
                                        checked={formData.isComplete}
                                        onChange={() => setFormData({ ...formData, isComplete: true })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-white">Collezione Completa</div>
                                        <div className="text-sm text-white/60">
                                            Hai già tutte le carte di questo set
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✅ NAVIGATION BUTTONS - Stesso stile dei tuoi bottoni esistenti */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                    {step > 1 ? (
                        <button
                            onClick={handlePrevStep}
                            disabled={loading}
                            className="flex items-center gap-2 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] 
                                     text-white/70 rounded-lg py-3 px-4 
                                     hover:bg-white/10 hover:border-white/20 hover:text-white 
                                     transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Indietro
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <div className="flex-1"></div>

                    {step < 3 ? (
                        <button
                            onClick={handleNextStep}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                     border border-purple-400/30 text-white rounded-lg py-3 px-6 
                                     hover:from-purple-500/40 hover:to-pink-500/40 
                                     hover:border-purple-400/50 transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Avanti
                        </button>
                    ) : (
                        <button
                            onClick={handleCreateCollection}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                     border border-purple-400/30 text-white rounded-lg py-3 px-6 
                                     hover:from-purple-500/40 hover:to-pink-500/40 
                                     hover:border-purple-400/50 transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creazione...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="w-4 h-4" />
                                    Crea Collezione
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateCollectionModal;
