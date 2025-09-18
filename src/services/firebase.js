// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    deleteDoc,
    setDoc,
    writeBatch,
    serverTimestamp,
    orderBy,
    Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8gVCBuREFQHQxruTBiAvMNSO8a6hH84Q",
    authDomain: "pokemon-card-collection-bbfc4.firebaseapp.com",
    projectId: "pokemon-card-collection-bbfc4",
    storageBucket: "pokemon-card-collection-bbfc4.firebasestorage.app",
    messagingSenderId: "935678885059",
    appId: "1:935678885059:web:c7b8fa1a5d7dc648287676"
};

// ✅ Inizializza Firebase PRIMA di esportare
const app = initializeApp(firebaseConfig);

// ✅ Esporta le istanze, non le funzioni
export const auth = getAuth(app);
export const db = getFirestore(app);
export { signOut };

// ✅ FUNZIONI PER GESTIRE LE COLLEZIONI
export const collectionsService = {

    // ✅ CREA COLLEZIONE (con supporto per wizard)
    async createCollection(collectionData, userId) {
        try {
            console.log('🔧 Creating collection:', collectionData);

            const docRef = await addDoc(collection(db, 'collections'), {
                name: collectionData.name,
                description: collectionData.description || '',
                gameId: collectionData.gameId || 'pokemon',
                language: collectionData.language || 'it',

                // ✅ Dati wizard specifici
                type: collectionData.type || 'standard', // standard | personalizzata
                setId: collectionData.setId || null,      // ID set se standard
                setName: collectionData.setName || null,  // Nome set se standard

                // ✅ Proprietario e membri
                ownerId: userId,
                ownerName: collectionData.ownerName || 'Unknown',
                members: {
                    [userId]: {
                        role: 'owner',
                        canEdit: true,
                        joinedAt: serverTimestamp()
                    }
                },

                // ✅ Visibilità e permessi
                visibility: collectionData.visibility || 'public', // public | private | friends

                // ✅ Statistiche iniziali
                stats: {
                    totalCards: collectionData.totalCards || 0,
                    ownedCards: collectionData.ownedCards || 0,
                    completionPercentage: 0
                },

                // ✅ Timestamp
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            console.log('✅ Collection created with ID:', docRef.id);
            return docRef.id;

        } catch (error) {
            console.error('❌ Error creating collection:', error);
            throw error;
        }
    },

    // ✅ OTTIENI COLLEZIONI UTENTE (ordinati per data creazione)
    async getUserCollections(userId) {
        try {
            const q = query(
                collection(db, 'collections'),
                where(`members.${userId}`, '!=', null),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const collections = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                collections.push({
                    id: doc.id,
                    ...data,
                    // ✅ Converti Timestamp in Date per compatibilità
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
                });
            });

            console.log(`✅ Loaded ${collections.length} collections for user ${userId}`);
            return collections;

        } catch (error) {
            console.error('❌ Error fetching user collections:', error);
            throw error;
        }
    },

    // ✅ OTTIENI SINGOLA COLLEZIONE
    async getCollection(collectionId) {
        try {
            const docRef = doc(db, 'collections', collectionId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
                };
            } else {
                throw new Error('Collection not found');
            }

        } catch (error) {
            console.error('❌ Error fetching collection:', error);
            throw error;
        }
    },

    // ✅ AGGIORNA COLLEZIONE
    async updateCollection(collectionId, updateData) {
        try {
            const docRef = doc(db, 'collections', collectionId);

            // ✅ Aggiorna stats se fornite
            if (updateData.stats) {
                updateData.stats = {
                    ...updateData.stats,
                    completionPercentage: updateData.stats.totalCards > 0
                        ? Math.round((updateData.stats.ownedCards / updateData.stats.totalCards) * 100)
                        : 0
                };
            }

            await updateDoc(docRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });

            console.log('✅ Collection updated:', collectionId);
            return true;

        } catch (error) {
            console.error('❌ Error updating collection:', error);
            throw error;
        }
    },

    // ✅ ELIMINA COLLEZIONE (con tutte le carte)
    async deleteCollection(collectionId) {
        try {
            // ✅ Prima elimina tutte le carte nella subcollection
            const cardsQuery = query(collection(db, 'collections', collectionId, 'cards'));
            const cardsSnapshot = await getDocs(cardsQuery);

            const batch = writeBatch(db);

            // Elimina tutte le carte
            cardsSnapshot.forEach((cardDoc) => {
                batch.delete(cardDoc.ref);
            });

            // Elimina la collezione
            const collectionRef = doc(db, 'collections', collectionId);
            batch.delete(collectionRef);

            await batch.commit();

            console.log('✅ Collection and all cards deleted:', collectionId);
            return true;

        } catch (error) {
            console.error('❌ Error deleting collection:', error);
            throw error;
        }
    },

    // ✅ AGGIUNGI CARTA ALLA COLLEZIONE
    async addCardToCollection(collectionId, cardData, language) {
        try {
            const cardRef = doc(db, 'collections', collectionId, 'cards', cardData.id);
            await setDoc(cardRef, {
                cardId: cardData.id,
                name: cardData.name,
                setId: cardData.set?.id || null,
                setName: cardData.set?.name || null,
                language: language,
                rarity: cardData.rarity || null,
                number: cardData.number || cardData.cardNumber || null,
                imageUrl: cardData.images?.small || cardData.image || null,
                owned: true,
                quantity: 1,
                condition: 'mint',
                notes: '',
                addedAt: serverTimestamp()
            });

            // ✅ Aggiorna stats collezione
            await this.updateCollectionStats(collectionId);

            console.log('✅ Card added to collection:', cardData.name);
            return true;

        } catch (error) {
            console.error('❌ Error adding card to collection:', error);
            throw error;
        }
    },

    // ✅ RIMUOVI CARTA DALLA COLLEZIONE
    async removeCardFromCollection(collectionId, cardId) {
        try {
            const cardRef = doc(db, 'collections', collectionId, 'cards', cardId);
            await deleteDoc(cardRef);

            // ✅ Aggiorna stats collezione
            await this.updateCollectionStats(collectionId);

            console.log('✅ Card removed from collection:', cardId);
            return true;

        } catch (error) {
            console.error('❌ Error removing card from collection:', error);
            throw error;
        }
    },

    // ✅ OTTIENI CARTE DI UNA COLLEZIONE
    async getCollectionCards(collectionId) {
        try {
            const cardsQuery = query(
                collection(db, 'collections', collectionId, 'cards'),
                orderBy('addedAt', 'desc')
            );

            const snapshot = await getDocs(cardsQuery);
            const cards = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                cards.push({
                    id: doc.id,
                    ...data,
                    addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
                });
            });

            return cards;

        } catch (error) {
            console.error('❌ Error fetching collection cards:', error);
            throw error;
        }
    },

    // ✅ AGGIORNA STATISTICHE COLLEZIONE
    async updateCollectionStats(collectionId) {
        try {
            const cards = await this.getCollectionCards(collectionId);
            const ownedCards = cards.filter(card => card.owned).length;
            const totalCards = cards.length;

            await this.updateCollection(collectionId, {
                stats: {
                    totalCards,
                    ownedCards,
                    completionPercentage: totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0
                }
            });

            return { totalCards, ownedCards };

        } catch (error) {
            console.error('❌ Error updating collection stats:', error);
            throw error;
        }
    },

    // ✅ BATCH INSERT CARTE (per wizard)
    async batchInsertCards(collectionId, cards, language, owned = true) {
        try {
            console.log(`🔧 Batch inserting ${cards.length} cards to collection ${collectionId}`);

            const batch = writeBatch(db);
            const cardsCollectionRef = collection(db, 'collections', collectionId, 'cards');

            cards.forEach(card => {
                const cardRef = doc(cardsCollectionRef, card.id);
                batch.set(cardRef, {
                    cardId: card.id,
                    name: card.name,
                    setId: card.set?.id || null,
                    setName: card.set?.name || null,
                    language: language,
                    rarity: card.rarity || null,
                    number: card.number || card.cardNumber || null,
                    imageUrl: card.images?.small || card.image || null,
                    owned: owned,
                    quantity: owned ? 1 : 0,
                    condition: owned ? 'mint' : null,
                    notes: '',
                    addedAt: serverTimestamp()
                });
            });

            await batch.commit();

            // ✅ Aggiorna stats collezione
            await this.updateCollectionStats(collectionId);

            console.log('✅ Batch insert completed');
            return true;

        } catch (error) {
            console.error('❌ Error in batch insert:', error);
            throw error;
        }
    }
};

