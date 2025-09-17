// src/components/cards/CardGrid.jsx - GRIGLIA PRINCIPALE CARTE
import { useState, useEffect } from 'react';
import CardItem from './CardItem';
import CardFilters from './CardFilters';
import CardModal from './CardModal';
import { pokemonAPI } from '../../services/pokemonAPI';

function CardGrid({
    collectionId,
    language = 'en',
    ownedCards = new Set(),
    onToggleOwned,
    className = ''
}) {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);
    const [availableSets, setAvailableSets] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        rarity: 'all',
        type: 'all',
        owned: 'all'
    });

    // ✅ CARICA SET DISPONIBILI
    useEffect(() => {
        loadAvailableSets();
    }, [language]);

    // ✅ CARICA CARTE QUANDO CAMBIA SET
    useEffect(() => {
        if (selectedSet) {
            loadCardsForSet(selectedSet.id);
        }
    }, [selectedSet, language]);

    // ✅ APPLICA FILTRI
    useEffect(() => {
        applyFilters();
    }, [cards, filters, ownedCards]);

    // ✅ CARICA SET DISPONIBILI
    const loadAvailableSets = async () => {
        try {
            setLoading(true);
            const response = await pokemonAPI.getSetsByLanguage(language);

            if (response.data && response.data.length > 0) {
                setAvailableSets(response.data);
                // Seleziona automaticamente il primo set
                setSelectedSet(response.data[0]);
            }
        } catch (error) {
            console.error('Error loading sets:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ CARICA CARTE PER SET
    const loadCardsForSet = async (setId) => {
        try {
            setLoading(true);
            const response = await pokemonAPI.getCardsBySet(setId, language, 1, 50);

            setCards(response.data || []);
        } catch (error) {
            console.error('Error loading cards:', error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ APPLICA FILTRI
    const applyFilters = () => {
        let filtered = [...cards];

        // Filtro ricerca
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(card =>
                card.name?.toLowerCase().includes(searchTerm)
            );
        }

        // Filtro rarità
        if (filters.rarity !== 'all') {
            filtered = filtered.filter(card => card.rarity === filters.rarity);
        }

        // Filtro tipo
        if (filters.type !== 'all') {
            filtered = filtered.filter(card =>
                card.types?.includes(filters.type)
            );
        }

        // Filtro possesso
        if (filters.owned === 'owned') {
            filtered = filtered.filter(card => ownedCards.has(card.id));
        } else if (filters.owned === 'needed') {
            filtered = filtered.filter(card => !ownedCards.has(card.id));
        }

        setFilteredCards(filtered);
    };

    // ✅ HANDLE TOGGLE OWNED
    const handleToggleOwned = async (card, newOwnedState) => {
        if (onToggleOwned) {
            await onToggleOwned(card, newOwnedState);
        }
    };

    // ✅ HANDLE VIEW DETAILS
    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    // ✅ STATS
    const totalCards = cards.length;
    const ownedCount = cards.filter(card => ownedCards.has(card.id)).length;
    const completionPercentage = totalCards > 0 ? Math.round((ownedCount / totalCards) * 100) : 0;

    return (
        <div className={`space-y-6 ${className}`}>

            {/* ✅ HEADER CON STATS */}
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Set Info */}
                    <div className="flex-1">
                        <h2 className="text-white text-xl font-semibold mb-2">
                            {selectedSet?.name || 'Loading set...'}
                        </h2>

                        {selectedSet && (
                            <div className="flex items-center gap-4 text-sm text-white/70">
                                <span>{totalCards} total cards</span>
                                <span>{ownedCount} owned</span>
                                <span className="text-green-300">{completionPercentage}% complete</span>
                            </div>
                        )}
                    </div>

                    {/* Set Selector */}
                    <div className="min-w-[200px]">
                        <select
                            value={selectedSet?.id || ''}
                            onChange={(e) => {
                                const set = availableSets.find(s => s.id === e.target.value);
                                setSelectedSet(set);
                            }}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-3 py-2 text-white text-sm
                         [&>option]:bg-gray-800 [&>option]:text-white"
                            disabled={loading}
                        >
                            {availableSets.map(set => (
                                <option key={set.id} value={set.id}>
                                    {set.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Progress Bar */}
                {totalCards > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-white/70 mb-2">
                            <span>Collection Progress</span>
                            <span>{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ FILTRI */}
            <CardFilters
                filters={filters}
                onFiltersChange={setFilters}
                cards={cards}
                loading={loading}
            />

            {/* ✅ GRIGLIA CARTE */}
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">

                {loading ? (
                    // Loading grid
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-[2.5/3.5] bg-white/10"></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-white/10 rounded"></div>
                                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCards.length > 0 ? (
                    // Cards grid
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                owned={ownedCards.has(card.id)}
                                onToggleOwned={handleToggleOwned}
                                onViewDetails={handleViewDetails}
                                loading={false}
                            />
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-white text-xl font-semibold mb-2">
                            No cards found
                        </h3>
                        <p className="text-white/70">
                            {filters.search || filters.rarity !== 'all' || filters.type !== 'all'
                                ? 'Try adjusting your filters'
                                : 'No cards available in this set'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ✅ MODAL DETTAGLIO CARTA */}
            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    owned={ownedCards.has(selectedCard.id)}
                    onToggleOwned={handleToggleOwned}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
}

export default CardGrid;
