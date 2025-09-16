// src/services/pokemonAPI.js
const BASE_URL = 'https://api.pokemontcg.io/v2';

// 🎯 Set di test popolari per iniziare
const TEST_SETS = [
    'base1',      // Base Set (Charizard, Blastoise, Venusaur)
    'xy1',        // XY Base Set 
    'swsh1'       // Sword & Shield Base Set
];

export const pokemonAPI = {
    // Ottieni set di test
    async getTestSets() {
        try {
            const response = await fetch(`${BASE_URL}/sets`);
            const data = await response.json();

            // Filtra solo i nostri set di test
            const testSets = data.data.filter(set => TEST_SETS.includes(set.id));
            return { data: testSets };
        } catch (error) {
            console.error('Error fetching test sets:', error);
            return { data: [] };
        }
    },

    // Ottieni carte di un set specifico
    async getCards(setId, page = 1, pageSize = 20) {
        try {
            const response = await fetch(
                `${BASE_URL}/cards?q=set.id:${setId}&page=${page}&pageSize=${pageSize}`
            );
            return response.json();
        } catch (error) {
            console.error('Error fetching cards:', error);
            return { data: [] };
        }
    },

    // Ottieni una carta specifica
    async getCard(cardId) {
        try {
            const response = await fetch(`${BASE_URL}/cards/${cardId}`);
            return response.json();
        } catch (error) {
            console.error('Error fetching card:', error);
            return { data: null };
        }
    }
};
