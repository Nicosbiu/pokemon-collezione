// src/components/collections/wizard/StepScegliPrefill.jsx
import { useEffect, useState } from 'react';
import { pokemonAPI } from '../../../services/pokemonAPI';

function StepScegliPrefill({ formData, aggiornaFormData, onSubmit, indietro, isLoading }) {
    const [loadingCards, setLoadingCards] = useState(false);
    const [cardsCount, setCardsCount] = useState(0);

    // ✅ Carica le carte del set per mostrare il numero
    useEffect(() => {
        async function caricaInfoCarte() {
            if (!formData.setSelezionato) return;

            setLoadingCards(true);
            try {
                const response = await pokemonAPI.getCardsBySet(
                    formData.setSelezionato.id,
                    formData.lingua,
                    1,
                    500
                );

                let carte = response.data || [];

                // Fallback se il metodo principale non funziona
                if (carte.length === 0) {
                    const altResponse = await pokemonAPI.getCardsAlternative(
                        formData.setSelezionato.id,
                        formData.lingua
                    );
                    carte = altResponse.data || [];
                }

                setCardsCount(carte.length);

                // ✅ Salva le carte per il batch insert
                aggiornaFormData({ cartePreview: carte });

            } catch (error) {
                console.error('Errore caricamento carte:', error);
                setCardsCount(formData.setSelezionato?.cardCount?.total || 0);
            } finally {
                setLoadingCards(false);
            }
        }

        caricaInfoCarte();
    }, [formData.setSelezionato, formData.lingua, aggiornaFormData]);

    return (
        <div className="space-y-6">

            <div className="text-center">
                <h3 className="text-white text-lg font-semibold mb-2">
                    Come vuoi iniziare?
                </h3>
                <p className="text-white/70 text-sm">
                    Scegli il punto di partenza per la tua collezione
                </p>
            </div>

            {/* ✅ INFO SET */}
            {formData.setSelezionato && (
                <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg p-4 text-center">
                    <h4 className="text-white font-medium mb-1">
                        {formData.setSelezionato.name}
                    </h4>
                    <div className="text-white/70 text-sm">
                        {loadingCards ? (
                            <span className="inline-flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                                Caricamento carte...
                            </span>
                        ) : (
                            <span>📦 {cardsCount} carte disponibili</span>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ OPZIONI PREFILL */}
            <div className="space-y-4">

                {/* Collezione vuota */}
                <label className={`cursor-pointer block p-6 rounded-2xl border transition-all duration-200 ${formData.prefill === 'vuota'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50'
                        : 'backdrop-blur-xl bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.20]'
                    }`}>
                    <input
                        type="radio"
                        name="prefill"
                        value="vuota"
                        checked={formData.prefill === 'vuota'}
                        onChange={(e) => aggiornaFormData({ prefill: e.target.value })}
                        className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                        <div className="text-2xl">⚪</div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Collezione Vuota</h4>
                            <p className="text-white/70 text-sm">
                                Inizia senza carte possedute. Potrai aggiungerle una per volta man mano che le ottieni.
                            </p>
                            <div className="text-white/50 text-xs mt-2">
                                💡 Perfetto per iniziare da zero
                            </div>
                        </div>
                    </div>
                </label>

                {/* Collezione completa */}
                <label className={`cursor-pointer block p-6 rounded-2xl border transition-all duration-200 ${formData.prefill === 'piena'
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50'
                        : 'backdrop-blur-xl bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.20]'
                    }`}>
                    <input
                        type="radio"
                        name="prefill"
                        value="piena"
                        checked={formData.prefill === 'piena'}
                        onChange={(e) => aggiornaFormData({ prefill: e.target.value })}
                        className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                        <div className="text-2xl">🟢</div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Collezione Completa</h4>
                            <p className="text-white/70 text-sm">
                                Inizia con tutte le carte già possedute. Potrai rimuovere quelle che non hai.
                            </p>
                            <div className="text-white/50 text-xs mt-2">
                                💡 Perfetto se hai già la maggior parte delle carte
                            </div>
                        </div>
                    </div>
                </label>
            </div>

            {/* ✅ PULSANTI FINALI */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={indietro}
                    disabled={isLoading}
                    className="flex-1 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] 
                     text-white/70 rounded-lg py-3 px-4 
                     hover:bg-white/10 hover:border-white/20 hover:text-white 
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Indietro
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isLoading || loadingCards}
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
                            Creazione...
                        </>
                    ) : (
                        <>
                            🚀 Crea Collezione
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default StepScegliPrefill;
