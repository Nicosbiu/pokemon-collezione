// src/utils/pokemonHelpers.js - UTILITY FUNCTIONS PER POKEMON
// ✅ RARITÀ CON COLORI E ICONE
export const RARITY_CONFIG = {
    'Common': { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: '●' },
    'Uncommon': { color: 'text-green-400', bg: 'bg-green-500/20', icon: '◆' },
    'Rare': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '★' },
    'Rare Holo': { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '✦' },
    'Ultra Rare': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '♦' },
    'Secret Rare': { color: 'text-pink-400', bg: 'bg-pink-500/20', icon: '♠' }
};

// ✅ TIPI POKEMON CON COLORI
export const TYPE_COLORS = {
    'Grass': '#78C850',
    'Fire': '#F08030',
    'Water': '#6890F0',
    'Lightning': '#F8D030',
    'Psychic': '#F85888',
    'Fighting': '#C03028',
    'Darkness': '#705848',
    'Metal': '#B8B8D0',
    'Fairy': '#EE99AC',
    'Dragon': '#7038F8',
    'Colorless': '#A8A878'
};

// ✅ FORMATTA NUMERO CARTA
export const formatCardNumber = (card) => {
    if (!card) return '';

    const cardNumber = card.cardNumber || card.number || '';
    const setTotal = card.setTotal || card.printedTotal || '';

    if (cardNumber && setTotal) {
        return `${cardNumber}/${setTotal}`;
    }

    return cardNumber || '';
};

// ✅ GET RARITY INFO
export const getRarityInfo = (rarity) => {
    return RARITY_CONFIG[rarity] || RARITY_CONFIG['Common'];
};

// ✅ GET TYPE COLOR
export const getTypeColor = (type) => {
    return TYPE_COLORS[type] || TYPE_COLORS['Colorless'];
};

// ✅ FORMATTA PREZZO (se disponibile)
export const formatPrice = (price, currency = 'EUR') => {
    if (!price || price === 0) return 'N/A';

    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(price);
};

// ✅ GET IMMAGINE ALTA QUALITÀ
export const getCardImage = (card, size = 'normal') => {
    if (!card || !card.image) return null;

    // TCGdx fornisce diverse dimensioni
    const images = card.image;

    switch (size) {
        case 'small':
            return images.small || images.normal || images.large;
        case 'normal':
            return images.normal || images.large || images.small;
        case 'large':
            return images.large || images.normal || images.small;
        default:
            return images.normal || images.large || images.small;
    }
};

// ✅ FILTRA CARTE PER CRITERIO
export const filterCards = (cards, filters) => {
    if (!cards || !Array.isArray(cards)) return [];

    return cards.filter(card => {
        // Filtra per nome
        if (filters.name) {
            const name = card.name?.toLowerCase() || '';
            const query = filters.name.toLowerCase();
            if (!name.includes(query)) return false;
        }

        // Filtra per tipo
        if (filters.type && filters.type !== 'all') {
            const types = card.types || [];
            if (!types.includes(filters.type)) return false;
        }

        // Filtra per rarità
        if (filters.rarity && filters.rarity !== 'all') {
            if (card.rarity !== filters.rarity) return false;
        }

        // Filtra per owned status (se applicabile)
        if (filters.owned !== undefined) {
            if (card.owned !== filters.owned) return false;
        }

        return true;
    });
};

// ✅ ORDINA CARTE
export const sortCards = (cards, sortBy = 'number') => {
    if (!cards || !Array.isArray(cards)) return [];

    return [...cards].sort((a, b) => {
        switch (sortBy) {
            case 'number':
                const numA = parseInt(a.cardNumber || a.number || '0');
                const numB = parseInt(b.cardNumber || b.number || '0');
                return numA - numB;

            case 'name':
                const nameA = (a.name || '').toLowerCase();
                const nameB = (b.name || '').toLowerCase();
                return nameA.localeCompare(nameB);

            case 'rarity':
                const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare'];
                const rarityA = rarityOrder.indexOf(a.rarity || 'Common');
                const rarityB = rarityOrder.indexOf(b.rarity || 'Common');
                return rarityB - rarityA; // Rare first

            case 'type':
                const typeA = (a.types?.[0] || 'Colorless').toLowerCase();
                const typeB = (b.types?.[0] || 'Colorless').toLowerCase();
                return typeA.localeCompare(typeB);

            default:
                return 0;
        }
    });
};

// ✅ CALCOLA STATS SET
export const calculateSetStats = (cards, ownedCards = []) => {
    if (!cards || !Array.isArray(cards)) {
        return {
            total: 0,
            owned: 0,
            completion: 0,
            byRarity: {},
            byType: {}
        };
    }

    const ownedIds = new Set(ownedCards.map(card => card.id || card.cardId));

    const stats = {
        total: cards.length,
        owned: 0,
        completion: 0,
        byRarity: {},
        byType: {}
    };

    cards.forEach(card => {
        const isOwned = ownedIds.has(card.id);

        if (isOwned) {
            stats.owned++;
        }

        // Stats per rarità
        const rarity = card.rarity || 'Common';
        if (!stats.byRarity[rarity]) {
            stats.byRarity[rarity] = { total: 0, owned: 0 };
        }
        stats.byRarity[rarity].total++;
        if (isOwned) {
            stats.byRarity[rarity].owned++;
        }

        // Stats per tipo
        const type = card.types?.[0] || 'Colorless';
        if (!stats.byType[type]) {
            stats.byType[type] = { total: 0, owned: 0 };
        }
        stats.byType[type].total++;
        if (isOwned) {
            stats.byType[type].owned++;
        }
    });

    stats.completion = stats.total > 0 ? Math.round((stats.owned / stats.total) * 100) : 0;

    return stats;
};

// ✅ EXPORT UTILITIES
export default {
    RARITY_CONFIG,
    TYPE_COLORS,
    formatCardNumber,
    getRarityInfo,
    getTypeColor,
    formatPrice,
    getCardImage,
    filterCards,
    sortCards,
    calculateSetStats
};
