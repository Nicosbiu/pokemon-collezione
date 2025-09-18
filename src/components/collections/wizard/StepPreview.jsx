// src/components/collections/wizard/StepPreview.jsx
import { useEffect, useState } from 'react';
import { CardGrid } from '../../cards'; // ✅ Path corretto per CardGrid
import { pokemonAPI } from '../../../services/pokemonAPI'; // ✅ Path corretto per pokemonAPI

function StepPreview({ formData, aggiornaFormData, onBack, onSubmit, isLoading }) {
    const [cardsDaMostrare, setCardsDaMostrare] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carica carte da mostrare in base a formData
    useEffect(() => {
        async function caricaCarte() {
            setLoading(true);
            try {
                let carte = [];

                if (formData.tipoCollezione === 'standard' && formData.setSelezionato) {
                    // Per set standard carica carte di quel set
                    console.log('🎴 Caricamento carte per set:', formData.setSelezionato.name);

                    let response = await pokemonAPI.getCardsBySet(
                        formData.setSelezionato.id,
                        formData.lingua,
                        1,
                        500
                    );

                    if (!response.data || response.data.length === 0) {
                        console.log('🔄 Provo metodo alternativo...');
                        response = await pokemonAPI.getCardsAlternative(
                            formData.setSelezionato.id,
                            formData.lingua
                        );
                    }

                    carte = response.data || [];
                    console.log('✅ Carte caricate:', carte.length);

                } else if (formData.tipoCollezione === 'personalizzata') {
                    // Per collezioni personalizzate usa i filtri
                    console.log('🎯 Caricamento carte personalizzate:', formData.filtriPersonalizzati);

                    let allCards = [];

                    if (formData.filtriPersonalizzati.pokemon) {
                        // Cerca carte per nome pokemon
                        const response = await pokemonAPI.searchCards(
                            formData.filtriPersonalizzati.pokemon,
                            formData.lingua,
                            500
                        );
                        allCards = response.data || [];
                        console.log(`🔍 Trovate ${allCards.length} carte per "${formData.filtriPersonalizzati.pokemon}"`);
                    } else {
                        // Se non c'è un pokemon specifico, carica carte casuali o da un set popolare
                        console.log('📦 Nessun pokemon specificato, carico set di default...');
                        const response = await pokemonAPI.getCardsBySet('swsh1', formData.lingua, 1, 50);
                        allCards = response.data || [];
                    }

                    // Applica filtro rarità lato client
                    if (formData.filtriPersonalizzati.rarity && formData.filtriPersonalizzati.rarity !== 'all') {
                        const rarityFilter = formData.filtriPersonalizzati.rarity.toLowerCase();
                        allCards = allCards.filter(carta =>
                            carta.rarity?.toLowerCase().includes(rarityFilter)
                        );
                        console.log(`🎭 Filtrate per rarità "${formData.filtriPersonalizzati.rarity}": ${allCards.length} carte`);
                    }

                    carte = allCards;
                } else {
                    carte = [];
                }

                setCardsDaMostrare(carte);

                // ✅ IMPORTANTE: Aggiorna formData con le carte caricate per il batch insert
                if (aggiornaFormData) {
                    aggiornaFormData({ cartePreview: carte });
                }

            } catch (error) {
                console.error('❌ Errore caricamento carte anteprima:', error);
                setCardsDaMostrare([]);
                if (aggiornaFormData) {
                    aggiornaFormData({ cartePreview: [] });
                }
            } finally {
                setLoading(false);
            }
        }

        caricaCarte();
    }, [formData.tipoCollezione, formData.setSelezionato, formData.filtriPersonalizzati, formData.lingua, aggiornaFormData]);

    // ✅ Determina quali carte saranno "possedute" in base al prefill
    const getOwnedCards = () => {
        if (formData.prefill === 'piena') {
            // Se prefill è "piena", tutte le carte sono possedute
            return new Set(cardsDaMostrare.map(carta => carta.id));
        } else if (formData.prefill === 'filtrata') {
            // Se prefill è "filtrata", tutte le carte filtrate sono possedute
            return new Set(cardsDaMostrare.map(carta => carta.id));
        } else {
            // Se prefill è "vuota", nessuna carta è posseduta
            return new Set();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Anteprima collezione</h2>

            {/* ✅ Info collezione */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">
                    {formData.nome}
                </h3>
                <div className="text-sm text-white/70 space-y-1">
                    <p><span className="font-medium">Tipo:</span> {formData.tipoCollezione === 'standard' ? 'Set Standard' : 'Personalizzata'}</p>
                    {formData.setSelezionato && (
                        <p><span className="font-medium">Set:</span> {formData.setSelezionato.name}</p>
                    )}
                    {formData.filtriPersonalizzati?.pokemon && (
                        <p><span className="font-medium">Pokémon:</span> {formData.filtriPersonalizzati.pokemon}</p>
                    )}
                    {formData.filtriPersonalizzati?.rarity && formData.filtriPersonalizzati.rarity !== 'all' && (
                        <p><span className="font-medium">Rarità:</span> {formData.filtriPersonalizzati.rarity}</p>
                    )}
                    <p><span className="font-medium">Prefill:</span> {
                        formData.prefill === 'vuota' ? 'Collezione vuota' :
                            formData.prefill === 'piena' ? 'Tutte le carte possedute' :
                                'Carte filtrate possedute'
                    }</p>
                    <p><span className="font-medium">Lingua:</span> {
                        formData.lingua === 'it' ? '🇮🇹 Italiano' :
                            formData.lingua === 'en' ? '🇺🇸 English' :
                                formData.lingua === 'ja' ? '🇯🇵 日本語' :
                                    formData.lingua === 'fr' ? '🇫🇷 Français' :
                                        formData.lingua === 'es' ? '🇪🇸 Español' :
                                            formData.lingua === 'de' ? '🇩🇪 Deutsch' :
                                                formData.lingua
                    }</p>
                </div>
            </div>

            {/* ✅ Stato caricamento */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    <span className="ml-3 text-white/70">Caricamento carte in corso...</span>
                </div>
            )}

            {/* ✅ Stato vuoto */}
            {!loading && cardsDaMostrare.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎴</div>
                    <p className="text-white/70 text-lg mb-2">
                        Nessuna carta trovata
                    </p>
                    <p className="text-white/50 text-sm">
                        Prova a modificare i filtri nel passaggio precedente
                    </p>
                </div>
            )}

            {/* ✅ Griglia carte con preview ownership */}
            {!loading && cardsDaMostrare.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">
                            {cardsDaMostrare.length} carte trovate
                        </h3>
                        <div className="text-sm text-white/70">
                            {formData.prefill === 'vuota' && '⚪ Nessuna carta posseduta'}
                            {formData.prefill === 'piena' && '🟢 Tutte le carte possedute'}
                            {formData.prefill === 'filtrata' && '🟡 Carte filtrate possedute'}
                        </div>
                    </div>

                    <CardGrid
                        cards={cardsDaMostrare.slice(0, 20)} // Mostra solo prime 20 per performance
                        ownedCards={getOwnedCards()}
                        onToggleOwned={() => { }} // Solo preview, non toggle
                        className="max-h-96 overflow-y-auto"
                    />

                    {cardsDaMostrare.length > 20 && (
                        <p className="text-center text-white/50 text-sm mt-4">
                            ... e altre {cardsDaMostrare.length - 20} carte
                        </p>
                    )}
                </div>
            )}

            {/* ✅ Pulsanti navigazione */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-lg border border-white/20 text-white/70 
                             hover:border-white/30 hover:text-white transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    ← Indietro
                </button>
                <button
                    onClick={onSubmit}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                             hover:from-purple-700 hover:to-pink-700 text-white font-medium
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2"
                    disabled={isLoading || loading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creazione in corso...
                        </>
                    ) : (
                        <>
                            🚀 Crea collezione
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default StepPreview;
