// src/services/pokemonAPI.js
const BASE_URL = 'https://api.tcgdx.net/v2';

// ✅ Supporto multilingua con TCGdx
const SUPPORTED_LANGUAGES = {
    'en': { name: 'English', flag: '🇺🇸' },
    'it': { name: 'Italiano', flag: '🇮🇹' },
    'ja': { name: '日本語', flag: '🇯🇵' },
    'fr': { name: 'Français', flag: '🇫🇷' },
    'es': { name: 'Español', flag: '🇪🇸' },
    'de': { name: 'Deutsch', flag: '🇩🇪' }
};

// Set di test per lingua (esempi)
const TEST_SETS_BY_LANGUAGE = {
    'en': ['base1', 'xy1', 'swsh1'],           // Set inglesi
    'it': ['base1', 'xy1', 'swsh1'],           // Set italiani (stessi ID, traduzioni diverse)
    'ja': ['s1h', 's1w', 'sm1']                // Set giapponesi (ID diversi!)
};

export const pokemonAPI = {

    // ✅ Ottieni set per lingua specifica
    async getSetsByLanguage(language = 'en') {
        try {
            const response = await fetch(`${BASE_URL}/${language}/sets`);
            const data = await response.json();

            // Filtra solo i set di test per quella lingua
            const testSetIds = TEST_SETS_BY_LANGUAGE[language] || [];
            const testSets = data.filter(set => testSetIds.includes(set.id));

            return { data: testSets };
        } catch (error) {
            console.error(`Error fetching ${language} sets:`, error);
            return { data: [] };
        }
    },

    // ✅ Ottieni carte per set e lingua
    async getCardsByLanguage(setId, language = 'en', page = 1) {
        try {
            const response = await fetch(
                `${BASE_URL}/${language}/sets/${setId}/cards?page=${page}`
            );
            return response.json();
        } catch (error) {
            console.error(`Error fetching ${language} cards for set ${setId}:`, error);
            return { data: [] };
        }
    },

    // ✅ Ottieni carta specifica in una lingua
    async getCardByLanguage(cardId, language = 'en') {
        try {
            const response = await fetch(`${BASE_URL}/${language}/cards/${cardId}`);
            return response.json();
        } catch (error) {
            console.error(`Error fetching ${language} card ${cardId}:`, error);
            return { data: null };
        }
    },

    // ✅ Lista lingue supportate
    getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }
};
