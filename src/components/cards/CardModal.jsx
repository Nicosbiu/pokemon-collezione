// src/components/cards/CardModal.jsx - MODAL DETTAGLIO CARTA
import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    HeartIcon,
    StarIcon,
    ClipboardDocumentIcon,
    ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// ✅ CONFIGURAZIONE RARITÀ (stessa di CardItem)
const RARITY_CONFIG = {
    'Common': { color: 'text-gray-400', bg: 'from-gray-500/20 to-gray-600/20', icon: '●' },
    'Uncommon': { color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20', icon: '◆' },
    'Rare': { color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/20', icon: '★' },
    'Rare Holo': { color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/20', icon: '✦' },
    'Ultra Rare': { color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20', icon: '♦' },
    'Secret Rare': { color: 'text-pink-400', bg: 'from-pink-500/20 to-pink-600/20', icon: '♠' }
};

const TYPE_COLORS = {
    'Grass': '#78C850', 'Fire': '#F08030', 'Water': '#6890F0',
    'Lightning': '#F8D030', 'Psychic': '#F85888', 'Fighting': '#C03028',
    'Darkness': '#705848', 'Metal': '#B8B8D0', 'Fairy': '#EE99AC',
    'Dragon': '#7038F8', 'Colorless': '#A8A878'
};

function CardModal({ card, owned = false, onToggleOwned, onClose }) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // ✅ CLOSE ON ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // ✅ PREVENT BODY SCROLL
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // ✅ GET CARD INFO
    const rarity = card.rarity || 'Common';
    const rarityConfig = RARITY_CONFIG[rarity] || RARITY_CONFIG['Common'];
    const cardNumber = card.number || card.cardNumber || '?';
    const setTotal = card.set?.total || card.total || '?';

    // ✅ GET CARD IMAGE
    const getCardImage = () => {
        if (card.image) {
            return typeof card.image === 'string' ? card.image : card.image.large || card.image.small;
        }
        return card.images?.large || card.images?.small || null;
    };

    const cardImage = getCardImage();

    // ✅ COPY CARD ID
    const copyCardId = async () => {
        try {
            await navigator.clipboard.writeText(card.id);
            // Puoi aggiungere un toast notification qui
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* ✅ BACKDROP */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* ✅ MODAL CONTENT */}
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto
                      backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl shadow-2xl">

                {/* ✅ HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.12]">
                    <div className="flex-1">
                        <h2 className="text-white text-2xl font-bold mb-2">
                            {card.name}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                            <span>{card.set?.name || 'Unknown Set'}</span>
                            <span>#{cardNumber}/{setTotal}</span>
                            {card.artist && <span>by {card.artist}</span>}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/[0.12] rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-white/70" />
                    </button>
                </div>

                {/* ✅ CONTENT */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ✅ IMMAGINE CARTA */}
                        <div className="space-y-4">
                            <div className="relative aspect-[2.5/3.5] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden">
                                {cardImage && !imageError ? (
                                    <>
                                        <img
                                            src={cardImage}
                                            alt={card.name}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                                }`}
                                            onLoad={() => setImageLoading(false)}
                                            onError={() => {
                                                setImageError(true);
                                                setImageLoading(false);
                                            }}
                                        />

                                        {imageLoading && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 animate-pulse">
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-white/50">
                                        <div className="text-6xl mb-4">🎴</div>
                                        <div className="text-center px-4">
                                            {imageError ? 'Image not available' : 'Loading...'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ✅ ACTION BUTTONS */}
                            <div className="flex items-center gap-3">

                                {/* Toggle Owned */}
                                <button
                                    onClick={() => onToggleOwned?.(card, !owned)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                              font-medium transition-all duration-200
                              ${owned
                                            ? 'bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30'
                                            : 'bg-gray-500/20 border border-gray-400/30 text-gray-300 hover:bg-gray-500/30'
                                        }`}
                                >
                                    {owned ? (
                                        <HeartIconSolid className="w-5 h-5" />
                                    ) : (
                                        <HeartIcon className="w-5 h-5" />
                                    )}
                                    <span>{owned ? 'Remove from Collection' : 'Add to Collection'}</span>
                                </button>

                                {/* Copy ID */}
                                <button
                                    onClick={copyCardId}
                                    className="p-3 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-xl
                            hover:bg-blue-500/30 transition-all duration-200"
                                    title="Copy Card ID"
                                >
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                </button>

                                {/* Share */}
                                <button
                                    className="p-3 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl
                            hover:bg-purple-500/30 transition-all duration-200"
                                    title="Share Card"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* ✅ DETTAGLI CARTA */}
                        <div className="space-y-6">

                            {/* Basic Info */}
                            <div className="space-y-4">

                                {/* Rarità */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">Rarity</label>
                                    <div className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium
                    bg-gradient-to-r ${rarityConfig.bg} ${rarityConfig.color}
                  `}>
                                        <span className="text-lg">{rarityConfig.icon}</span>
                                        <span>{rarity}</span>
                                    </div>
                                </div>

                                {/* Tipi */}
                                {card.types && card.types.length > 0 && (
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">Types</label>
                                        <div className="flex flex-wrap gap-2">
                                            {card.types.map(type => (
                                                <div
                                                    key={type}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-white text-sm"
                                                    style={{ backgroundColor: `${TYPE_COLORS[type] || TYPE_COLORS['Colorless']}20` }}
                                                >
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-white/30"
                                                        style={{ backgroundColor: TYPE_COLORS[type] || TYPE_COLORS['Colorless'] }}
                                                    ></div>
                                                    <span>{type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* HP */}
                                {card.hp && (
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">HP</label>
                                        <div className="text-white text-xl font-bold">{card.hp}</div>
                                    </div>
                                )}

                                {/* Attacks */}
                                {card.attacks && card.attacks.length > 0 && (
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-3">Attacks</label>
                                        <div className="space-y-3">
                                            {card.attacks.map((attack, index) => (
                                                <div key={index} className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-white font-semibold">{attack.name}</h4>
                                                        {attack.damage && (
                                                            <span className="text-red-300 font-bold">{attack.damage}</span>
                                                        )}
                                                    </div>

                                                    {/* Energy Cost */}
                                                    {attack.cost && attack.cost.length > 0 && (
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {attack.cost.map((energy, energyIndex) => (
                                                                <div
                                                                    key={energyIndex}
                                                                    className="w-6 h-6 rounded-full border border-white/30 text-xs flex items-center justify-center text-white"
                                                                    style={{ backgroundColor: TYPE_COLORS[energy] || TYPE_COLORS['Colorless'] }}
                                                                >
                                                                    {energy[0]}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Attack Description */}
                                                    {attack.text && (
                                                        <p className="text-white/80 text-sm">{attack.text}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Weaknesses & Resistances */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Weaknesses */}
                                    {card.weaknesses && card.weaknesses.length > 0 && (
                                        <div>
                                            <label className="block text-white/70 text-sm font-medium mb-2">Weaknesses</label>
                                            <div className="space-y-1">
                                                {card.weaknesses.map((weakness, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-white/30"
                                                            style={{ backgroundColor: TYPE_COLORS[weakness.type] || TYPE_COLORS['Colorless'] }}
                                                        ></div>
                                                        <span className="text-white">{weakness.type}</span>
                                                        <span className="text-red-300">{weakness.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resistances */}
                                    {card.resistances && card.resistances.length > 0 && (
                                        <div>
                                            <label className="block text-white/70 text-sm font-medium mb-2">Resistances</label>
                                            <div className="space-y-1">
                                                {card.resistances.map((resistance, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-white/30"
                                                            style={{ backgroundColor: TYPE_COLORS[resistance.type] || TYPE_COLORS['Colorless'] }}
                                                        ></div>
                                                        <span className="text-white">{resistance.type}</span>
                                                        <span className="text-green-300">{resistance.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Retreat Cost */}
                                {card.retreatCost && card.retreatCost.length > 0 && (
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">Retreat Cost</label>
                                        <div className="flex items-center gap-1">
                                            {card.retreatCost.map((energy, index) => (
                                                <div
                                                    key={index}
                                                    className="w-6 h-6 rounded-full border border-white/30 text-xs flex items-center justify-center text-white"
                                                    style={{ backgroundColor: TYPE_COLORS[energy] || TYPE_COLORS['Colorless'] }}
                                                >
                                                    {energy[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Card ID */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">Card ID</label>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1 text-white/90 text-sm font-mono">
                                            {card.id}
                                        </code>
                                        <button
                                            onClick={copyCardId}
                                            className="p-1 hover:bg-white/[0.12] rounded transition-colors"
                                            title="Copy"
                                        >
                                            <ClipboardDocumentIcon className="w-4 h-4 text-white/50" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardModal;
