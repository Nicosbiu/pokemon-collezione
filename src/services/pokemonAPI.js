// src/services/pokemonAPI.js - VERSIONE CORRETTA
import TCGdex from '@tcgdex/sdk';

// ✅ LINGUE SUPPORTATE
const SUPPORTED_LANGUAGES = {
    'en': { name: 'English', flag: '🇺🇸' },
    'it': { name: 'Italiano', flag: '🇮🇹' },
    'ja': { name: '日本語', flag: '🇯🇵' },
    'fr': { name: 'Français', flag: '🇫🇷' },
    'es': { name: 'Español', flag: '🇪🇸' },
    'de': { name: 'Deutsch', flag: '🇩🇪' }
};

// ✅ CACHE
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

export class PokemonAPI {

    // ✅ CREA CLIENT CORRETTO
    static getClient(language = 'en') {
        try {
            const tcgdex = new TCGdex(language);
            return tcgdex;
        } catch (error) {
            console.error('❌ Error creating TCGdex client:', error);
            throw error;
        }
    }

    // ✅ TEST CONNESSIONE CORRETTO
    static async testConnection(language = 'en') {
        try {
            console.log('🔍 Testing TCGdex SDK connection...');

            const tcgdex = new TCGdex(language);
            console.log('✅ TCGdex client created:', tcgdex);

            // ✅ USA IL METODO FETCH CORRETTO
            const card = await tcgdex.fetch('cards', 'swsh3-136');
            console.log('✅ Sample card retrieved:', card?.name);

            return {
                success: true,
                language: language,
                sdk: '@tcgdex/sdk',
                sampleCard: card?.name || 'Card not found',
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ TCGdex SDK connection failed:', error);
            return {
                success: false,
                error: error.message,
                language: language,
                sdk: '@tcgdex/sdk',
                timestamp: new Date().toISOString()
            };
        }
    }

    // ✅ OTTIENI TUTTI I SET - METODO CORRETTO
    static async getSetsByLanguage(language = 'en') {
        try {
            const tcgdex = new TCGdex(language);

            // ✅ USA fetch('sets') per ottenere tutti i set
            const sets = await tcgdex.fetch('sets');

            return {
                data: sets || [],
                total: sets?.length || 0,
                language: language,
                source: 'tcgdex.net'
            };

        } catch (error) {
            return {
                data: [],
                total: 0,
                language: language,
                error: error.message,
                source: 'tcgdex.net'
            };
        }
    }

    // ✅ OTTIENI CARTE PER SET - SINTASSI CORRETTA
    static async getCardsBySet(setId, language = 'en', page = 1, pageSize = 12) {
        try {
            const tcgdex = new TCGdex(language);

            // ✅ USA fetch per ottenere il set e le sue carte
            const set = await tcgdex.fetch('sets', setId);

            // Le carte sono già incluse nel set
            const cards = set?.cards || [];

            // Paginazione manuale
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedCards = cards.slice(startIndex, endIndex);

            return {
                data: paginatedCards,
                total: cards.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(cards.length / pageSize),
                language: language,
                setId: setId,
                source: 'tcgdex.net'
            };

        } catch (error) {
            return {
                data: [],
                total: 0,
                page: page,
                language: language,
                setId: setId,
                error: error.message,
                source: 'tcgdex.net'
            };
        }
    }

    // ✅ RICERCA CARTE - NON SUPPORTATA DIRETTAMENTE
    static async searchCards(query, language = 'en', limit = 12) {
        try {
            const tcgdex = new TCGdex(language);

            // ✅ Ottieni tutte le carte e filtra localmente
            const allCards = await tcgdex.fetch('cards');

            const filteredCards = allCards.filter(card =>
                card.name?.toLowerCase().includes(query.toLowerCase()) ||
                card.id?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, limit);

            return {
                data: filteredCards,
                total: filteredCards.length,
                query: query,
                language: language,
                source: 'tcgdex.net'
            };

        } catch (error) {
            return {
                data: [],
                total: 0,
                query: query,
                language: language,
                error: error.message,
                source: 'tcgdex.net'
            };
        }
    }

    // ✅ OTTIENI SERIE
    static async getSeries(language = 'en') {
        try {
            const tcgdex = new TCGdex(language);

            // ✅ USA fetch('series') per ottenere tutte le serie
            const series = await tcgdex.fetch('series');

            return {
                data: series || [],
                total: series?.length || 0,
                language: language,
                source: 'tcgdex.net'
            };

        } catch (error) {
            return {
                data: [],
                total: 0,
                language: language,
                error: error.message,
                source: 'tcgdex.net'
            };
        }
    }

    // ✅ CARTA CASUALE - IMPLEMENTAZIONE ALTERNATIVA
    static async getRandomCard(language = 'en') {
        try {
            const tcgdex = new TCGdex(language);

            // Ottieni tutte le carte e selezionane una casuale
            const allCards = await tcgdex.fetch('cards');
            const randomIndex = Math.floor(Math.random() * allCards.length);
            const card = allCards[randomIndex];

            return {
                data: card,
                language: language,
                source: 'tcgdex.net'
            };

        } catch (error) {
            return {
                data: null,
                language: language,
                error: error.message,
                source: 'tcgdex.net'
            };
        }
    }

    // ✅ UTILITY METHODS
    static getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    static clearCache() {
        cache.clear();
        console.log('🗑️ Cache cleared');
    }

    static getCacheStats() {
        return {
            sdk: '@tcgdex/sdk (new TCGdex(language))',
            cache: { size: cache.size },
            supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
            lastUpdate: new Date().toISOString()
        };
    }
}

// ✅ EXPORT
export default PokemonAPI;

export const pokemonAPI = {
    testConnection: (lang) => PokemonAPI.testConnection(lang),
    getSetsByLanguage: (lang) => PokemonAPI.getSetsByLanguage(lang),
    getCardsBySet: (setId, lang, page, pageSize) => PokemonAPI.getCardsBySet(setId, lang, page, pageSize),
    searchCards: (query, lang, limit) => PokemonAPI.searchCards(query, lang, limit),
    getRandomCard: (lang) => PokemonAPI.getRandomCard(lang),
    getSeries: (lang) => PokemonAPI.getSeries(lang),
    getSupportedLanguages: () => PokemonAPI.getSupportedLanguages(),
    clearCache: () => PokemonAPI.clearCache(),
    getCacheStats: () => PokemonAPI.getCacheStats()
};
