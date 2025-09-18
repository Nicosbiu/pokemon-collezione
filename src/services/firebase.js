// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch,
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

    // Crea una nuova collezione
    async createCollection(collectionData, userId) {
        try {
            const docRef = await addDoc(collection(db, 'collections'), {
                name: collectionData.name,
                description: collectionData.description || '',
                gameId: collectionData.gameId,
                language: collectionData.language || 'en', // ✅ LINGUA COLLEZIONE
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

    // ✅ AGGIORNA una collezione esistente
    async updateCollection(collectionId, updateData) {
        try {
            const docRef = doc(db, 'collections', collectionId);
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

    // ✅ ELIMINA una collezione
    async deleteCollection(collectionId) {
        try {
            await deleteDoc(doc(db, 'collections', collectionId));
            console.log('✅ Collection deleted:', collectionId);
            return true;
        } catch (error) {
            console.error('❌ Error deleting collection:', error);
            throw error;
        }
    },

    // Ottieni collezioni dell'utente
    async getUserCollections(userId) {
        try {
            // ✅ Query per collezioni dove l'utente è membro
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

    // ✅ Aggiungi carta CON lingua alla collezione
    async addCardToCollection(collectionId, cardData, language) {
        try {
            const cardRef = doc(db, 'collections', collectionId, 'cards', cardData.id);
            await setDoc(cardRef, {
                cardId: cardData.id,
                name: cardData.name,
                setId: cardData.set?.id,
                language: language,           // ✅ LINGUA CARTA
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
    },

    // ✅ NUOVA: Crea collezione base con set completo
    async createBaseCollection(collectionData, setData, setCards, isComplete = false) {
        const batch = writeBatch(db);

        try {
            // 1. Crea il documento collezione principale
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
                isComplete: isComplete,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // 2. Salva il set nella cache se non esiste già
            const setRef = doc(db, 'sets', setData.id);
            batch.set(setRef, setData, { merge: true });

            // 3. Salva tutte le carte nella cache
            setCards.forEach(card => {
                const cardRef = doc(db, 'cards', card.id);
                batch.set(cardRef, {
                    ...card,
                    setId: setData.id,
                    language: collectionData.language
                }, { merge: true });
            });

            // 4. Crea i record di ownership per ogni carta
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

            // 5. Commit della batch operation
            await batch.commit();

            return { success: true, collectionId };

        } catch (error) {
            console.error('❌ Error creating base collection:', error);
            return { success: false, error: error.message };
        }
    },

    // ✅ NUOVA: Verifica se un set è già in cache
    async getSetFromCache(setId) {
        try {
            const setDoc = await getDoc(doc(db, 'sets', setId));
            return setDoc.exists() ? { id: setDoc.id, ...setDoc.data() } : null;
        } catch (error) {
            console.error('❌ Error getting set from cache:', error);
            return null;
        }
    }
};

