// src/components/collections/wizard/StepScegliTipo.jsx
import { pokemonAPI } from '../../../services/pokemonAPI';

function StepScegliTipo({ formData, aggiornaFormData, avanti, onClose, isLoading }) {
    const supportedLanguages = pokemonAPI.getSupportedLanguages();

    const canProceed = formData.nome.trim() && formData.tipoCollezione;

    return (
        <div className="space-y-6">

            {/* ✅ FORM BASE - Stesso stile della tua CreateCollectionModal */}
            <div>
                <label className="block text-white/70 text-sm mb-2">
                    Nome Collezione *
                </label>
                <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => aggiornaFormData({ nome: e.target.value })}
                    disabled={isLoading}
                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                     rounded-lg px-4 py-3 text-white placeholder-white/50 
                     focus:outline-none focus:border-white/30 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Es. Set Evoluzioni Eteree"
                    required
                />
            </div>

            <div>
                <label className="block text-white/70 text-sm mb-2">
                    Descrizione (Opzionale)
                </label>
                <textarea
                    value={formData.descrizione}
                    onChange={(e) => aggiornaFormData({ descrizione: e.target.value })}
                    disabled={isLoading}
                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                     rounded-lg px-4 py-3 text-white placeholder-white/50 
                     focus:outline-none focus:border-white/30 transition-all resize-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Descrizione della collezione..."
                    rows="3"
                />
            </div>

            <div>
                <label className="block text-white/70 text-sm mb-2">
                    Lingua Collezione
                </label>
                <select
                    value={formData.lingua}
                    onChange={(e) => aggiornaFormData({ lingua: e.target.value })}
                    disabled={isLoading}
                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                     rounded-lg px-4 py-3 text-white 
                     focus:outline-none focus:border-white/30 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     [&>option]:bg-gray-800 [&>option]:text-white"
                >
                    {Object.entries(supportedLanguages).map(([code, info]) => (
                        <option key={code} value={code}>
                            {info.flag} {info.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ TIPO COLLEZIONE */}
            <div>
                <label className="block text-white/70 text-sm mb-4">
                    Tipo di Collezione *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Set Standard */}
                    <button
                        onClick={() => aggiornaFormData({ tipoCollezione: 'standard' })}
                        disabled={isLoading}
                        className={`p-6 rounded-2xl border transition-all duration-200 text-left
                        disabled:opacity-50 disabled:cursor-not-allowed ${formData.tipoCollezione === 'standard'
                                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/50'
                                : 'backdrop-blur-xl bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.20]'
                            }`}
                    >
                        <div className="text-2xl mb-3">📦</div>
                        <h3 className="text-white font-semibold mb-2">Set Standard</h3>
                        <p className="text-white/70 text-sm">
                            Scegli un set ufficiale Pokémon e inizia la collezione
                        </p>
                    </button>

                    {/* Personalizzata */}
                    <button
                        onClick={() => aggiornaFormData({ tipoCollezione: 'personalizzata' })}
                        disabled={true} // ✅ Disabilitato per ora
                        className="p-6 rounded-2xl border backdrop-blur-xl bg-white/[0.02] border-white/[0.08] 
                       opacity-50 cursor-not-allowed text-left"
                    >
                        <div className="text-2xl mb-3">🎯</div>
                        <h3 className="text-white/50 font-semibold mb-2">Personalizzata</h3>
                        <p className="text-white/30 text-sm">
                            In arrivo prossimamente...
                        </p>
                    </button>
                </div>
            </div>

            {/* ✅ PULSANTI - Stesso stile della tua modal */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
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

export default StepScegliTipo;
