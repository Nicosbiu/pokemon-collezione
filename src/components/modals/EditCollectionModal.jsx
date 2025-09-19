// src/components/modals/EditCollectionModal.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { PokemonAPI } from '../../services/pokemonAPI';
import toast from 'react-hot-toast';

function EditCollectionModal({ isOpen, onClose, onSubmit, collection, isLoading = false }) {
    // ✅ STATO FORM - Usa lo stesso pattern del CreateModal
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        gameId: 'pokemon',
        language: 'it' // Default italiano
    });

    // ✅ STATO DI VALIDAZIONE
    const [hasChanges, setHasChanges] = useState(false);
    const [originalData, setOriginalData] = useState({});

    const supportedLanguages = PokemonAPI.getSupportedLanguages();

    // ✅ POPOLA IL FORM CON I DATI ESISTENTI
    useEffect(() => {
        if (collection && isOpen) {
            const data = {
                name: collection.name || '',
                description: collection.description || '',
                gameId: collection.gameId || 'pokemon',
                language: collection.language || 'it'
            };

            setFormData(data);
            setOriginalData(data);
            setHasChanges(false);
        }
    }, [collection, isOpen]);

    // ✅ RILEVA CAMBIAMENTI NEL FORM
    useEffect(() => {
        const changed = Object.keys(formData).some(
            key => formData[key] !== originalData[key]
        );
        setHasChanges(changed);
    }, [formData, originalData]);

    // ✅ RESET FORM QUANDO SI CHIUDE
    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', description: '', gameId: 'pokemon', language: 'it' });
            setOriginalData({});
            setHasChanges(false);
        }
    }, [isOpen]);

    // ✅ GESTIONE INPUT CHANGE
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ✅ SUBMIT DEL FORM
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Il nome della collezione è obbligatorio');
            return;
        }

        if (!hasChanges) {
            toast.info('Nessuna modifica da salvare');
            return;
        }

        // Chiama la funzione onSubmit del parent con i dati aggiornati
        onSubmit(collection.id, formData);
    };

    // ✅ CHIUDI MODALE CON CONFERMA SE CI SONO MODIFICHE
    const handleClose = () => {
        if (hasChanges) {
            if (window.confirm('Ci sono modifiche non salvate. Vuoi davvero uscire?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* ✅ HEADER MIGLIORATO */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                            <PencilIcon className="w-5 h-5 text-purple-400" />
                            Modifica Collezione
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            Aggiorna le informazioni della tua collezione
                        </p>
                        {collection?.name && (
                            <p className="text-white/40 text-xs mt-1">
                                Collezione: {collection.name}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-white/70 hover:text-white transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* ✅ BADGE STATO MODIFICHE */}
                {hasChanges && (
                    <div className="mb-6 p-3 backdrop-blur-xl bg-orange-500/10 border border-orange-400/20 
                                   rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-orange-300 text-sm">Modifiche non salvate</span>
                    </div>
                )}

                {/* ✅ FORM CON STILE IDENTICO AL CREATE MODAL */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Nome Collezione */}
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Nome Collezione *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-lg px-4 py-3 text-white placeholder-white/50 
                                     focus:outline-none focus:border-purple-500 transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="La mia collezione Pokemon"
                            maxLength={50}
                        />
                        <div className="text-right text-xs text-white/40 mt-1">
                            {formData.name.length}/50
                        </div>
                    </div>

                    {/* Descrizione */}
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Descrizione (Opzionale)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-lg px-4 py-3 text-white placeholder-white/50 
                                     focus:outline-none focus:border-purple-500 transition-all resize-none
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Descrivi la tua collezione..."
                            rows={3}
                            maxLength={200}
                        />
                        <div className="text-right text-xs text-white/40 mt-1">
                            {formData.description.length}/200
                        </div>
                    </div>

                    {/* Grid per Lingua e Gioco */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Lingua */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">
                                Lingua
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                disabled={isLoading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                         rounded-lg px-4 py-3 text-white 
                                         focus:outline-none focus:border-purple-500 transition-all
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

                        {/* Gioco */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2">
                                Gioco di Carte
                            </label>
                            <select
                                value={formData.gameId}
                                onChange={(e) => handleInputChange('gameId', e.target.value)}
                                disabled={isLoading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                         rounded-lg px-4 py-3 text-white 
                                         focus:outline-none focus:border-purple-500 transition-all
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="pokemon">Pokémon TCG</option>
                                <option value="magic" disabled>Magic (Prossimamente)</option>
                                <option value="yugioh" disabled>Yu-Gi-Oh (Prossimamente)</option>
                            </select>
                        </div>
                    </div>

                    {/* ✅ INFORMAZIONI COLLEZIONE (se disponibili) */}
                    {collection && (
                        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg p-4">
                            <h3 className="font-medium text-white mb-3 text-sm">Informazioni Collezione</h3>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1 text-white/70">
                                    <div><strong>Tipo:</strong> {collection.type === 'base' ? 'Base Set' : 'Personalizzata'}</div>
                                    {collection.setName && (
                                        <div><strong>Set:</strong> {collection.setName}</div>
                                    )}
                                    {collection.totalCards && (
                                        <div><strong>Carte totali:</strong> {collection.totalCards}</div>
                                    )}
                                </div>
                                <div className="space-y-1 text-white/70">
                                    <div><strong>Creata:</strong> {collection.createdAt?.toDate?.()?.toLocaleDateString?.('it-IT') || 'N/A'}</div>
                                    {collection.ownedCards !== undefined && (
                                        <div><strong>Possedute:</strong> {collection.ownedCards || 0}</div>
                                    )}
                                    {collection.totalCards && collection.ownedCards !== undefined && (
                                        <div>
                                            <strong>Completezza:</strong> {
                                                collection.totalCards > 0
                                                    ? Math.round((collection.ownedCards / collection.totalCards) * 100)
                                                    : 0
                                            }%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* ✅ NAVIGATION BUTTONS - Stile identico al CreateModal */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] 
                                 text-white/70 rounded-lg py-3 px-4 
                                 hover:bg-white/10 hover:border-white/20 hover:text-white 
                                 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Annulla
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.name.trim() || !hasChanges}
                        className="flex-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                 border border-purple-400/30 text-white rounded-lg py-3 px-4 
                                 hover:from-purple-500/40 hover:to-pink-500/40 
                                 hover:border-purple-400/50 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Aggiornamento...
                            </>
                        ) : (
                            <>
                                <PencilIcon className="w-4 h-4" />
                                Aggiorna Collezione
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCollectionModal;
