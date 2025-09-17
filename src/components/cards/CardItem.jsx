// src/components/cards/CardItem.jsx - COMPONENTE SINGOLA CARTA
import { useState } from 'react';
import { HeartIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// ✅ CONFIGURAZIONE RARITÀ
const RARITY_CONFIG = {
    'Common': {
        color: 'text-gray-400',
        bg: 'from-gray-500/20 to-gray-600/20',
        icon: '●',
        border: 'border-gray-400/30'
    },
    'Uncommon': {
        color: 'text-green-400',
        bg: 'from-green-500/20 to-green-600/20',
        icon: '◆',
        border: 'border-green-400/30'
    },
    'Rare': {
        color: 'text-blue-400',
        bg: 'from-blue-500/20 to-blue-600/20',
        icon: '★',
        border: 'border-blue-400/30'
    },
    'Rare Holo': {
        color: 'text-purple-400',
        bg: 'from-purple-500/20 to-purple-600/20',
        icon: '✦',
        border: 'border-purple-400/30'
    },
    'Ultra Rare': {
        color: 'text-yellow-400',
        bg: 'from-yellow-500/20 to-yellow-600/20',
        icon: '♦',
        border: 'border-yellow-400/30'
    },
    'Secret Rare': {
        color: 'text-pink-400',
        bg: 'from-pink-500/20 to-pink-600/20',
        icon: '♠',
        border: 'border-pink-400/30'
    }
};

// ✅ COLORI TIPI POKEMON
const TYPE_COLORS = {
    'Grass': '#78C850', 'Fire': '#F08030', 'Water': '#6890F0',
    'Lightning': '#F8D030', 'Psychic': '#F85888', 'Fighting': '#C03028',
    'Darkness': '#705848', 'Metal': '#B8B8D0', 'Fairy': '#EE99AC',
    'Dragon': '#7038F8', 'Colorless': '#A8A878'
};

function CardItem({
    card,
    owned = false,
    onToggleOwned,
    onViewDetails,
    loading = false,
    className = ''
}) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // ✅ GET CARD INFO
    const rarity = card.rarity || 'Common';
    const rarityConfig = RARITY_CONFIG[rarity] || RARITY_CONFIG['Common'];
    const cardNumber = card.number || card.cardNumber || '?';
    const setTotal = card.set?.total || card.total || '?';
    const primaryType = card.types?.[0] || 'Colorless';
    const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS['Colorless'];

    // ✅ GET CARD IMAGE
    const getCardImage = () => {
        if (card.image) {
            // TCGdex format
            return typeof card.image === 'string' ? card.image : card.image.large || card.image.small;
        }
        // Pokemon TCG API format
        return card.images?.large || card.images?.small || null;
    };

    const cardImage = getCardImage();

    // ✅ HANDLE IMAGE ERROR
    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    return (
        <div className={`group relative ${className}`}>
            <div className={`
        backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
        rounded-2xl overflow-hidden transition-all duration-300
        hover:bg-white/[0.12] hover:border-white/[0.20] hover:scale-[1.02]
        ${owned ? 'ring-2 ring-green-400/50' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}>

                {/* ✅ CARD IMAGE */}
                <div className="relative aspect-[2.5/3.5] bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                    {cardImage && !imageError ? (
                        <>
                            <img
                                src={cardImage}
                                alt={card.name}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                    }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                loading="lazy"
                            />

                            {/* Loading Skeleton */}
                            {imageLoading && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 animate-pulse">
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // ✅ PLACEHOLDER NO IMAGE
                        <div className="flex flex-col items-center justify-center h-full text-white/50">
                            <div className="text-4xl mb-2">🎴</div>
                            <div className="text-xs text-center px-2">
                                {imageError ? 'Image not available' : 'Loading...'}
                            </div>
                        </div>
                    )}

                    {/* ✅ OWNED INDICATOR */}
                    {owned && (
                        <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm rounded-full p-1.5">
                            <HeartIconSolid className="w-4 h-4 text-white" />
                        </div>
                    )}

                    {/* ✅ CARD NUMBER */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                        <span className="text-white/90 text-xs font-medium">
                            {cardNumber}/{setTotal}
                        </span>
                    </div>

                    {/* ✅ TYPE INDICATOR */}
                    {primaryType !== 'Colorless' && (
                        <div
                            className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: typeColor }}
                            title={primaryType}
                        ></div>
                    )}
                </div>

                {/* ✅ CARD INFO */}
                <div className="p-4">
                    {/* Nome carta */}
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                        {card.name}
                    </h3>

                    {/* Rarità */}
                    <div className={`flex items-center gap-2 mb-3`}>
                        <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
              bg-gradient-to-r ${rarityConfig.bg} border ${rarityConfig.border}
              ${rarityConfig.color}
            `}>
                            <span>{rarityConfig.icon}</span>
                            <span>{rarity}</span>
                        </div>
                    </div>

                    {/* Set info */}
                    {card.set?.name && (
                        <div className="text-white/60 text-xs mb-3 truncate">
                            {card.set.name}
                        </div>
                    )}

                    {/* ✅ ACTION BUTTONS */}
                    <div className="flex items-center justify-between">
                        {/* Toggle Owned */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleOwned?.(card, !owned);
                            }}
                            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-200
                ${owned
                                    ? 'bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30'
                                    : 'bg-gray-500/20 border border-gray-400/30 text-gray-300 hover:bg-gray-500/30'
                                }
              `}
                            disabled={loading}
                        >
                            {owned ? (
                                <HeartIconSolid className="w-4 h-4" />
                            ) : (
                                <HeartIcon className="w-4 h-4" />
                            )}
                            <span>{owned ? 'Owned' : 'Need'}</span>
                        </button>

                        {/* View Details */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails?.(card);
                            }}
                            className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300
                        hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
                            title="View Details"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardItem;
