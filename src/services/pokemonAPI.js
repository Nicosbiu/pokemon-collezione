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

    // ✅ NUOVA: Ottieni singola carta per ID
    static async getCardById(cardId, language = 'en') {
        try {
            const cacheKey = `card_${cardId}_${language}`;

            // Controlla cache prima
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                return cached.data;
            }

            console.log(`🔍 Fetching card ${cardId} in ${language}...`);

            const tcgdx = this.getClient(language);
            const card = await tcgdx.fetch('cards', cardId);

            if (card) {
                // Salva in cache
                cache.set(cacheKey, {
                    data: card,
                    timestamp: Date.now()
                });
            }

            return card;
        } catch (error) {
            console.error(`❌ Error fetching card ${cardId}:`, error);
            return null;
        }
    }

    // ✅ OTTIENI CARTE PER SET - SINTASSI CORRETTA
    static async getCardsBySet(setId, language = 'en', page = 1, pageSize = 250) {
        try {
            console.log(`🔍 Fetching cards for set ${setId} in ${language}...`);

            const tcgdx = this.getClient(language);
            const set = await tcgdx.fetch('sets', setId);

            if (!set || !set.cards) {
                throw new Error(`Set ${setId} not found or has no cards`);
            }

            // ✅ HELPER: Costruisci URL immagine secondo documentazione TCGdx
            const buildTCGdxImageUrl = (baseImageUrl) => {
                if (!baseImageUrl) return null;

                // Se l'URL ha già un'estensione, usala così com'è
                if (baseImageUrl.includes('.png') || baseImageUrl.includes('.jpg') || baseImageUrl.includes('.webp')) {
                    return baseImageUrl;
                }

                // ✅ FORMATO CORRETTO secondo documentazione TCGdx
                // {base_url}/{quality}.{extension}
                return {
                    small: `${baseImageUrl}/low.webp`,    // 245x337 per thumbnail
                    large: `${baseImageUrl}/high.webp`    // 600x825 per visualizzazione
                };
            };

            // ✅ MAPPA LE CARTE CON IMMAGINI CORRETTE
            const cardsWithImages = set.cards.map(card => {
                const imageUrls = buildTCGdxImageUrl(card.image);

                return {
                    id: card.id,
                    name: card.name || 'Unknown',
                    number: card.localId || card.number || '1',
                    rarity: card.rarity || 'Common',
                    types: card.types || [],
                    hp: card.hp || null,
                    setId: setId,
                    // ✅ IMMAGINI CON FORMATO CORRETTO
                    images: imageUrls || {
                        small: null,
                        large: null
                    },
                    set: {
                        id: setId,
                        name: set.name || 'Unknown Set'
                    }
                };
            }).filter(card => card.id && card.images && card.images.small); // ✅ Filtra carte senza immagini

            // Paginazione
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedCards = cardsWithImages.slice(startIndex, endIndex);

            console.log(`✅ Processed ${paginatedCards.length} cards with images`);
            console.log('📷 Sample image URLs:');
            console.log('  Small:', paginatedCards[0]?.images?.small);
            console.log('  Large:', paginatedCards[0]?.images?.large);

            return {
                data: paginatedCards,
                total: cardsWithImages.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(cardsWithImages.length / pageSize),
                language: language,
                setId: setId,
                source: 'tcgdx'
            };

        } catch (error) {
            console.error(`❌ Error in PokemonAPI.getCardsBySet for ${setId}:`, error);
            return {
                data: [],
                total: 0,
                page: page,
                language: language,
                setId: setId,
                error: error.message,
                source: 'tcgdx'
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