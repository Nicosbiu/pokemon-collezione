// src/components/collections/wizard/StepConfigPersonalizzato.jsx
import { useState } from 'react';

function StepConfigPersonalizzato({ formData, aggiornaFormData, avanti, indietro }) {
    const [pokeTarget, setPokeTarget] = useState(formData.filtriPersonalizzati.pokemon || '');
    const [rarity, setRarity] = useState(formData.filtriPersonalizzati.rarity || 'all');

    // Aggiungi campi filtro aggiuntivi se vuoi (tipo, nome, artista)

    const salvaFiltri = () => {
        aggiornaFormData({
            filtriPersonalizzati: {
                pokemon: pokeTarget,
                rarity: rarity
            }
        });
        avanti();
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Filtri personalizzati</h2>

            <div className="mb-4">
                <label className="block mb-2">Nome Pokémon (facoltativo)</label>
                <input
                    type="text"
                    placeholder="Es. Pikachu"
                    value={pokeTarget}
                    onChange={e => setPokeTarget(e.target.value)}
                    className="w-full p-2 rounded bg-gray-900 text-white"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-2">Rarità (facoltativa)</label>
                <select
                    value={rarity}
                    onChange={e => setRarity(e.target.value)}
                    className="w-full p-2 rounded bg-gray-900 text-white"
                >
                    <option value="all">Tutte</option>
                    <option value="common">Comune</option>
                    <option value="uncommon">Non Comune</option>
                    <option value="rare">Rara</option>
                    <option value="rare holo">Rara Olografica</option>
                    <option value="ultra rare">Ultra Rara</option>
                    <option value="secret rare">Segreta</option>
                </select>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={indietro}
                    className="px-4 py-2 rounded border border-gray-700 hover:border-gray-600"
                >
                    Indietro
                </button>
                <button
                    onClick={salvaFiltri}
                    className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
                >
                    Avanti
                </button>
            </div>
        </div>
    );
}

export default StepConfigPersonalizzato;
