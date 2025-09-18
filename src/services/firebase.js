// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch,
    setDoc,
    getDoc,
    increment
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8gVCBuREFQHQxruTBiAvMNSO8a6hH84Q",
    authDomain: "pokemon-card-collection-bbfc4.firebaseapp.com",
    projectId: "pokemon-card-collection-bbfc4",
    storageBucket: "pokemon-card-collection-bbfc4.firebasestorage.app",
    messagingSenderId: "935678885059",
    appId: "1:935678885059:web:c7b8fa1a5d7dc648287676"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { signOut };

export const collectionsService = {

    // ✅ MANTIENI - Funzione originale
    async createCollection(collectionData, userId) {
        try {
            const docRef = await addDoc(collection(db, 'collections'), {
                name: collectionData.name,
                description: collectionData.description || '',
                gameId: collectionData.gameId,
                language: collectionData.language || 'it',
                ownerId: userId,
                members: {
                    [userId]: {
                        role: 'owner',
                        canEdit: true,
                        joinedAt: serverTimestamp()
                    }
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('❌ Error creating collection:', error);
            throw error;
        }
    },

    // ✅ MANTIENI - Funzione per collezioni base
    // Nel tuo CreateCollectionModal.jsx, modifica la funzione createBaseCollection:

    async createBaseCollection(collectionData, setData, setCards, isComplete = false) {
        const batch = writeBatch(db);

        try {
            console.log(`🔥 Creating collection with ${setCards.length} cards...`);

            const collectionRef = doc(collection(db, 'collections'));
            const collectionId = collectionRef.id;

            batch.set(collectionRef, {
                ...collectionData,
                id: collectionId,
                type: 'base',
                setId: setData.id,
                setName: setData.name,
                totalCards: setCards.length,
                ownedCards: isComplete ? setCards.length : 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Cache del set
            const setRef = doc(db, 'sets', setData.id);
            batch.set(setRef, setData, { merge: true });

            // ✅ IMPORTANTE: Salva le carte CON le immagini
            setCards.forEach((card, index) => {
                const cardRef = doc(db, 'cards', card.id);

                // ✅ FUNZIONE HELPER per rimuovere undefined
                const cleanData = (obj) => {
                    const cleaned = {};
                    for (const [key, value] of Object.entries(obj)) {
                        if (value !== undefined && value !== null) {
                            if (typeof value === 'object' && !Array.isArray(value)) {
                                // Ricorsivo per oggetti nested
                                const cleanedNested = cleanData(value);
                                if (Object.keys(cleanedNested).length > 0) {
                                    cleaned[key] = cleanedNested;
                                }
                            } else {
                                cleaned[key] = value;
                            }
                        }
                    }
                    return cleaned;
                };

                // ✅ DATI CARTA PULITI
                const cleanCardData = cleanData({
                    id: card.id,
                    name: card.name || 'Unknown',
                    number: card.localId || card.number || (index + 1).toString(),
                    rarity: card.rarity || 'Unknown', // ✅ Default per rarity undefined
                    setId: setData.id,
                    language: collectionData.language,
                    images: {
                        small: card.image || card.images?.small || null,
                        large: card.image || card.images?.large || card.images?.small || null
                    },
                    types: card.types || [],
                    hp: card.hp || null,
                    set: {
                        id: setData.id,
                        name: setData.name
                    }
                });

                batch.set(cardRef, cleanCardData, { merge: true });

                if (index % 10 === 0) {
                    console.log(`💾 Processed card ${index + 1}/${setCards.length}: ${card.name}`);
                }
            });

            // Ownership records
            setCards.forEach(card => {
                const ownershipRef = doc(
                    db,
                    'ownership',
                    `${collectionData.ownerId}_${collectionId}_${card.id}`
                );
                batch.set(ownershipRef, {
                    userId: collectionData.ownerId,
                    collectionId: collectionId,
                    cardId: card.id,
                    owned: isComplete,
                    addedAt: serverTimestamp()
                });
            });

            console.log('🔥 Committing batch operation...');
            await batch.commit();
            console.log('✅ Collection created successfully!');

            return { success: true, collectionId };

        } catch (error) {
            console.error('❌ Error creating base collection:', error);
            return { success: false, error: error.message };
        }
    },

    // ✅ MANTIENI le altre funzioni esistenti
    async updateCollection(collectionId, updateData) {
        try {
            const docRef = doc(db, 'collections', collectionId);
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('❌ Error updating collection:', error);
            throw error;
        }
    },

    async deleteCollection(collectionId) {
        try {
            await deleteDoc(doc(db, 'collections', collectionId));
            return true;
        } catch (error) {
            console.error('❌ Error deleting collection:', error);
            throw error;
        }
    },

    async getUserCollections(userId) {
        try {
            const q = query(
                collection(db, 'collections'),
                where(`members.${userId}`, '!=', null)
            );

            const querySnapshot = await getDocs(q);
            const collections = [];

            querySnapshot.forEach((doc) => {
                collections.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return collections;
        } catch (error) {
            console.error('❌ Error fetching collections:', error);
            throw error;
        }
    },

    // ✅ CORREZIONE - Risolve il conflitto di nomi
    async getCollectionById(collectionId) {
        try {
            const docRef = doc(db, 'collections', collectionId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting collection:', error);
            throw error;
        }
    },

    // ✅ CORREZIONE - Risolve il conflitto di nomi 
    async getCollectionCards(collectionId) {
        try {
            // Prima ottieni i dati della collezione
            const collectionData = await this.getCollectionById(collectionId);
            if (!collectionData) return [];

            if (collectionData.type === 'base' && collectionData.setId) {
                // ✅ FIX: Usa query per ottenere carte del set dalla cache
                const cardsQuery = query(
                    collection(db, 'cards'), // ✅ QUESTO È OK - usa la funzione collection()
                    where('setId', '==', collectionData.setId)
                );
                const querySnapshot = await getDocs(cardsQuery);

                return querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => {
                        const aNum = parseInt(a.number) || 0;
                        const bNum = parseInt(b.number) || 0;
                        return aNum - bNum;
                    });
            }

            return [];
        } catch (error) {
            console.error('❌ Error getting collection cards:', error);
            throw error;
        }
    },

    // ✅ CORREZIONE - Risolve il conflitto di nomi
    async getUserOwnership(userId, collectionId) {
        try {
            const ownershipQuery = query(
                collection(db, 'ownership'), // ✅ QUESTO È OK - usa la funzione collection()
                where('userId', '==', userId),
                where('collectionId', '==', collectionId),
                where('owned', '==', true)
            );

            const querySnapshot = await getDocs(ownershipQuery);
            return querySnapshot.docs.map(doc => doc.data().cardId);
        } catch (error) {
            console.error('❌ Error getting user ownership:', error);
            throw error;
        }
    },

    // ✅ MANTIENI - Aggiorna ownership
    async updateCardOwnership(userId, collectionId, cardId, owned) {
        try {
            const ownershipId = `${userId}_${collectionId}_${cardId}`;
            const ownershipRef = doc(db, 'ownership', ownershipId);

            await setDoc(ownershipRef, {
                userId,
                collectionId,
                cardId,
                owned,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Aggiorna contatore collezione
            if (owned) {
                await this.incrementOwnedCards(collectionId);
            } else {
                await this.decrementOwnedCards(collectionId);
            }

        } catch (error) {
            console.error('❌ Error updating card ownership:', error);
            throw error;
        }
    },

    // ✅ MANTIENI - Helper cache set
    async getSetFromCache(setId) {
        try {
            const setDoc = await getDoc(doc(db, 'sets', setId));
            return setDoc.exists() ? { id: setDoc.id, ...setDoc.data() } : null;
        } catch (error) {
            console.error('❌ Error getting set from cache:', error);
            return null;
        }
    },

    // ✅ MANTIENI - Helper contatori
    async incrementOwnedCards(collectionId) {
        const collectionRef = doc(db, 'collections', collectionId);
        await updateDoc(collectionRef, {
            ownedCards: increment(1),
            updatedAt: serverTimestamp()
        });
    },

    async decrementOwnedCards(collectionId) {
        const collectionRef = doc(db, 'collections', collectionId);
        await updateDoc(collectionRef, {
            ownedCards: increment(-1),
            updatedAt: serverTimestamp()
        });
    },

    // ✅ MANTIENI - Aggiungi carta
    async addCardToCollection(collectionId, cardData, language) {
        try {
            const cardRef = doc(db, 'collections', collectionId, 'cards', cardData.id);
            await setDoc(cardRef, {
                cardId: cardData.id,
                name: cardData.name,
                setId: cardData.set?.id,
                language: language,
                imageUrl: cardData.image,
                owned: true,
                quantity: 1,
                addedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('❌ Error adding card to collection:', error);
            throw error;
        }
    }
};
