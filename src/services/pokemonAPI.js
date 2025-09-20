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

    // ✅ OTTIENI CARTE PER SET - CON FALLBACK LINGUA
    static async getCardsBySet(setId, language = 'en', page = 1, pageSize = 250) {
        try {
            console.log(`🔍 Fetching cards for set ${setId} in ${language}...`);

            // ✅ PROVA PRIMA LINGUA RICHIESTA
            let tcgdx = this.getClient(language);
            let set;
            let usedLanguage = language;

            try {
                set = await tcgdx.fetch('sets', setId);
            } catch (error) {
                console.warn(`⚠️ Error fetching set ${setId} in ${language}:`, error);
                set = null;
            }

            // ✅ SE NESSUNA CARTA O SET VUOTO, PROVA FALLBACK INGLESE
            if (!set || !set.cards || set.cards.length === 0) {
                if (language !== 'en') {
                    console.warn(`⚠️ Set ${setId} not found or empty in ${language}, trying English fallback...`);

                    try {
                        tcgdx = this.getClient('en');
                        set = await tcgdx.fetch('sets', setId);
                        usedLanguage = 'en';

                        if (set && set.cards && set.cards.length > 0) {
                            console.log(`✅ Found ${set.cards.length} cards in English for set ${setId}`);
                        }
                    } catch (englishError) {
                        console.error(`❌ Failed to fetch set ${setId} in English:`, englishError);
                    }
                }
            }

            if (!set) {
                throw new Error(`Set ${setId} not found in any language`);
            }

            if (!set.cards || set.cards.length === 0) {
                throw new Error(`No cards found for set ${setId} in any language`);
            }

            // ✅ HELPER: Costruisci URL immagine secondo documentazione TCGdx
            const buildTCGdxImageUrl = (baseImageUrl) => {
                if (!baseImageUrl) return null;

                if (baseImageUrl.includes('.png') || baseImageUrl.includes('.jpg') || baseImageUrl.includes('.webp')) {
                    return baseImageUrl;
                }

                return {
                    small: `${baseImageUrl}/low.webp`,
                    large: `${baseImageUrl}/high.webp`
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
                    images: imageUrls || {
                        small: null,
                        large: null
                    },
                    set: {
                        id: setId,
                        name: set.name || 'Unknown Set'
                    },
                    attacks: card.attacks || [],
                    abilities: card.abilities || [],
                    weaknesses: card.weaknesses || [],
                    resistances: card.resistances || []
                };
            }).filter(card => card.id); // ✅ Filtra solo per ID

            // Paginazione
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedCards = cardsWithImages.slice(startIndex, endIndex);

            console.log(`✅ Processed ${paginatedCards.length} cards for set ${setId} in ${usedLanguage}`);

            // ✅ DEBUG: Mostra se è fallback
            if (usedLanguage !== language) {
                console.log(`🌍 Language fallback applied: ${language} → ${usedLanguage}`);
            }

            return {
                data: paginatedCards,
                total: cardsWithImages.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(cardsWithImages.length / pageSize),
                language: usedLanguage, // ✅ LINGUA EFFETTIVAMENTE USATA
                requestedLanguage: language, // ✅ LINGUA ORIGINALMENTE RICHIESTA
                setId: setId,
                source: 'tcgdx',
                isFallback: usedLanguage !== language // ✅ FLAG FALLBACK
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