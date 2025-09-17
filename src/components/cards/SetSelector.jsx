// src/components/cards/SetSelector.jsx - SELEZIONE SET POKEMON
import { useState, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { pokemonAPI } from '../../services/pokemonAPI';

function SetSelector({
    language = 'en',
    selectedSet,
    onSetChange,
    className = ''
}) {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ CARICA SET QUANDO CAMBIA LINGUA
    useEffect(() => {
        loadSets();
    }, [language]);

    // ✅ CARICA SET DISPONIBILI
    const loadSets = async () => {
        try {
            setLoading(true);
            const response = await pokemonAPI.getSetsByLanguage(language);
            setSets(response.data || []);

            // Seleziona automaticamente il primo set se non ce n'è uno selezionato
            if (!selectedSet && response.data?.length > 0) {
                onSetChange?.(response.data[0]);
            }
        } catch (error) {
            console.error('Error loading sets:', error);
            setSets([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FILTRA SET PER RICERCA
    const filteredSets = sets.filter(set =>
        set.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.series?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ SELEZIONA SET
    const handleSetSelect = (set) => {
        onSetChange?.(set);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative ${className}`}>

            {/* ✅ SELECTOR BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-3 
                   backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                   rounded-xl text-white hover:bg-white/[0.12] hover:border-white/[0.20]
                   transition-all duration-200 disabled:opacity-50"
            >
                <div className="flex-1 text-left">
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-white/20 rounded w-32 mb-1"></div>
                            <div className="h-3 bg-white/10 rounded w-24"></div>
                        </div>
                    ) : selectedSet ? (
                        <div>
                            <div className="font-medium">{selectedSet.name}</div>
                            <div className="text-sm text-white/70">
                                {selectedSet.series} • {selectedSet.total || '?'} cards
                            </div>
                        </div>
                    ) : (
                        <div className="text-white/70">Select a set...</div>
                    )}
                </div>

                <ChevronDownIcon
                    className={`w-5 h-5 text-white/50 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>

            {/* ✅ DROPDOWN LIST */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20
                        backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-xl shadow-2xl max-h-80 overflow-hidden">

                    {/* Search */}
                    <div className="p-3 border-b border-white/[0.08]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                            <input
                                type="text"
                                placeholder="Search sets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/[0.08] border border-white/[0.12] 
                           rounded-lg text-white placeholder-white/50 text-sm
                           focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.12]"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Sets List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredSets.length > 0 ? (
                            filteredSets.map((set) => (
                                <button
                                    key={set.id}
                                    onClick={() => handleSetSelect(set)}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/[0.08] 
                              transition-colors duration-150 border-b border-white/[0.05] last:border-b-0
                              ${selectedSet?.id === set.id ? 'bg-white/[0.12] border-l-4 border-l-purple-400' : ''}`}
                                >
                                    <div className="font-medium text-white">{set.name}</div>
                                    <div className="text-sm text-white/70 mt-1">
                                        {set.series && <span>{set.series} • </span>}
                                        <span>{set.total || '?'} cards</span>
                                        {set.releaseDate && (
                                            <span> • {new Date(set.releaseDate).getFullYear()}</span>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-white/50">
                                {searchTerm ? 'No sets found' : 'No sets available'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ CLOSE DROPDOWN ON OUTSIDE CLICK */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default SetSelector;
