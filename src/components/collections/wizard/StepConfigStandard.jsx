// src/components/collections/wizard/StepConfigStandard.jsx
import { useEffect, useState } from 'react';
import { pokemonAPI } from '../../../services/pokemonAPI';

function StepConfigStandard({ formData, aggiornaFormData, avanti, indietro, isLoading }) {
    const [sets, setSets] = useState([]);
    const [loadingSets, setLoadingSets] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function caricaSets() {
            setLoadingSets(true);
            setError(null);
            try {
                console.log('📦 Caricamento set per lingua:', formData.lingua);
                const response = await pokemonAPI.getSetsByLanguage(formData.lingua);

                if (response.data && response.data.length > 0) {
                    setSets(response.data);
                    console.log(`✅ Caricati ${response.data.length} set`);
                } else {
                    setError('Nessun set trovato per questa lingua');
                }
            } catch (err) {
                console.error('❌ Errore caricamento set:', err);
                setError('Errore nel caricamento dei set');
            } finally {
                setLoadingSets(false);
            }
        }
        caricaSets();
    }, [formData.lingua]);

    const canProceed = formData.setSelezionato;

    return (
        <div className="space-y-6">

            <div className="text-center">
                <h3 className="text-white text-lg font-semibold mb-2">
                    Seleziona il Set Pokémon
                </h3>
                <p className="text-white/70 text-sm">
                    Scegli quale set ufficiale vuoi collezionare
                </p>
            </div>

            {/* ✅ LOADING STATE */}
            {loadingSets && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    <span className="ml-3 text-white/70">Caricamento set...</span>
                </div>
            )}

            {/* ✅ ERROR STATE */}
            {error && (
                <div className="backdrop-blur-xl bg-red-500/10 border border-red-400/20 rounded-lg p-4">
                    <p className="text-red-300 text-sm">⚠️ {error}</p>
                </div>
            )}

            {/* ✅ SET SELECTOR */}
            {!loadingSets && !error && sets.length > 0 && (
                <div>
                    <label className="block text-white/70 text-sm mb-2">
                        Set Pokémon *
                    </label>
                    <select
                        value={formData.setSelezionato?.id || ''}
                        onChange={(e) => {
                            const selected = sets.find(s => s.id === e.target.value);
                            aggiornaFormData({
                                setSelezionato: selected,
                                // Carica automaticamente le carte del set per il prefill
                                cartePreview: [] // Reset carte preview quando cambia set
                            });
                        }}
                        disabled={isLoading}
                        className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                       rounded-lg px-4 py-3 text-white 
                       focus:outline-none focus:border-white/30 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                        <option value="">-- Seleziona un set --</option>
                        {sets.map(set => (
                            <option key={set.id} value={set.id}>
                                {set.name} ({set.cardCount?.total || set.cardCount || '?'} carte)
                                {set.releaseDate && ` - ${new Date(set.releaseDate).getFullYear()}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* ✅ SET INFO */}
            {formData.setSelezionato && (
                <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">
                        {formData.setSelezionato.name}
                    </h4>
                    <div className="text-white/70 text-sm space-y-1">
                        <p>📦 {formData.setSelezionato.cardCount?.total || formData.setSelezionato.cardCount || 0} carte totali</p>
                        {formData.setSelezionato.series && (
                            <p>📚 Serie: {formData.setSelezionato.series}</p>
                        )}
                        {formData.setSelezionato.releaseDate && (
                            <p>📅 Rilascio: {new Date(formData.setSelezionato.releaseDate).toLocaleDateString('it-IT')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ PULSANTI */}
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
                    onClick={avanti}
                    disabled={!canProceed || isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                     border border-purple-400/30 text-white rounded-lg py-3 px-4 
                     hover:from-purple-500/40 hover:to-pink-500/40 
                     hover:border-purple-400/50 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continua →
                </button>
            </div>
        </div>
    );
}

export default StepConfigStandard;
