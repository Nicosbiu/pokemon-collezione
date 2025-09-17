// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
    serverTimestamp
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
    }
};

