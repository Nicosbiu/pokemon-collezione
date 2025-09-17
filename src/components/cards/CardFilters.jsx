// src/components/cards/CardFilters.jsx - SISTEMA FILTRI CARTE
import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

function CardFilters({ filters, onFiltersChange, cards = [], loading = false }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // ✅ ESTRAI RARITÀ E TIPI DISPONIBILI DAI DATI
    const { availableRarities, availableTypes } = useMemo(() => {
        if (!cards.length) return { availableRarities: [], availableTypes: [] };

        const rarities = new Set();
        const types = new Set();

        cards.forEach(card => {
            if (card.rarity) rarities.add(card.rarity);
            if (card.types?.length) {
                card.types.forEach(type => types.add(type));
            }
        });

        return {
            availableRarities: Array.from(rarities).sort(),
            availableTypes: Array.from(types).sort()
        };
    }, [cards]);

    // ✅ AGGIORNA FILTRO
    const updateFilter = (key, value) => {
        onFiltersChange(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // ✅ RESET FILTRI
    const resetFilters = () => {
        onFiltersChange({
            search: '',
            rarity: 'all',
            type: 'all',
            owned: 'all'
        });
    };

    // ✅ CONTA FILTRI ATTIVI
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.rarity !== 'all') count++;
        if (filters.type !== 'all') count++;
        if (filters.owned !== 'all') count++;
        return count;
    }, [filters]);

    return (
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl overflow-hidden">

            {/* ✅ HEADER FILTRI */}
            <div className="p-4 border-b border-white/[0.12]">
                <div className="flex items-center justify-between">

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search cards..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg text-white placeholder-white/50 text-sm
                         focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.12]
                         transition-all duration-200"
                            disabled={loading}
                        />
                    </div>

                    {/* Filter Toggle & Reset */}
                    <div className="flex items-center gap-2 ml-4">

                        {/* Active Filters Count */}
                        {activeFiltersCount > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/70">
                                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                                </span>
                                <button
                                    onClick={resetFilters}
                                    className="p-1.5 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300
                            hover:bg-red-500/30 transition-all duration-200"
                                    title="Clear filters"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Expand Filters Button */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${activeFiltersCount > 0
                                    ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300'
                                    : 'bg-white/[0.08] border border-white/[0.12] text-white/70'
                                }
                          hover:bg-white/[0.12] hover:border-white/[0.20]`}
                            disabled={loading}
                        >
                            <FunnelIcon className="w-4 h-4" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <div className="w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ FILTRI AVANZATI (ESPANDIBILI) */}
            {isExpanded && (
                <div className="p-4 bg-white/[0.05] border-t border-white/[0.08]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Filtro Rarità */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Rarity
                            </label>
                            <select
                                value={filters.rarity}
                                onChange={(e) => updateFilter('rarity', e.target.value)}
                                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-lg px-3 py-2 
                           text-white text-sm [&>option]:bg-gray-800 [&>option]:text-white
                           focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.12]"
                                disabled={loading}
                            >
                                <option value="all">All Rarities</option>
                                {availableRarities.map(rarity => (
                                    <option key={rarity} value={rarity}>
                                        {rarity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Tipo */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => updateFilter('type', e.target.value)}
                                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-lg px-3 py-2 
                           text-white text-sm [&>option]:bg-gray-800 [&>option]:text-white
                           focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.12]"
                                disabled={loading}
                            >
                                <option value="all">All Types</option>
                                {availableTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Possesso */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Ownership
                            </label>
                            <select
                                value={filters.owned}
                                onChange={(e) => updateFilter('owned', e.target.value)}
                                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-lg px-3 py-2 
                           text-white text-sm [&>option]:bg-gray-800 [&>option]:text-white
                           focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.12]"
                                disabled={loading}
                            >
                                <option value="all">All Cards</option>
                                <option value="owned">Owned Only</option>
                                <option value="needed">Needed Only</option>
                            </select>
                        </div>
                    </div>

                    {/* ✅ FILTRI RAPIDI */}
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-white/70 text-sm font-medium">Quick Filters:</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Rarità comuni */}
                            {['Rare', 'Rare Holo', 'Ultra Rare'].filter(rarity =>
                                availableRarities.includes(rarity)
                            ).map(rarity => (
                                <button
                                    key={rarity}
                                    onClick={() => updateFilter('rarity', filters.rarity === rarity ? 'all' : rarity)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                              ${filters.rarity === rarity
                                            ? 'bg-purple-500/30 border border-purple-400/50 text-purple-200'
                                            : 'bg-white/[0.08] border border-white/[0.12] text-white/70 hover:bg-white/[0.12]'
                                        }`}
                                    disabled={loading}
                                >
                                    {rarity}
                                </button>
                            ))}

                            {/* Separatore */}
                            <div className="w-px h-6 bg-white/[0.12] mx-2"></div>

                            {/* Tipi comuni */}
                            {['Fire', 'Water', 'Grass', 'Lightning'].filter(type =>
                                availableTypes.includes(type)
                            ).map(type => (
                                <button
                                    key={type}
                                    onClick={() => updateFilter('type', filters.type === type ? 'all' : type)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                              ${filters.type === type
                                            ? 'bg-blue-500/30 border border-blue-400/50 text-blue-200'
                                            : 'bg-white/[0.08] border border-white/[0.12] text-white/70 hover:bg-white/[0.12]'
                                        }`}
                                    disabled={loading}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardFilters;
