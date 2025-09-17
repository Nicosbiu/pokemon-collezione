// src/hooks/useCollectionCards.js - HOOK PER GESTIRE CARTE NELLE COLLEZIONI
import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import toast from 'react-hot-toast';

export function useCollectionCards(collectionId) {
    const [ownedCards, setOwnedCards] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ REFERENCE ALLA SUBCOLLECTION CARDS
    const getCardsRef = useCallback(() => {
        if (!collectionId) return null;
        return collection(db, 'collections', collectionId, 'cards');
    }, [collectionId]);

    // ✅ CARICA CARTE POSSEDUTE (REAL-TIME)
    useEffect(() => {
        if (!collectionId) return;

        const cardsRef = getCardsRef();
        if (!cardsRef) return;

        setLoading(true);

        // ✅ REAL-TIME LISTENER
        const unsubscribe = onSnapshot(cardsRef,
            (snapshot) => {
                const owned = new Set();
                snapshot.forEach((doc) => {
                    if (doc.data().owned) {
                        owned.add(doc.id); // doc.id è il cardId
                    }
                });
                setOwnedCards(owned);
                setLoading(false);
                setError(null);
            },
            (error) => {
                console.error('Error loading owned cards:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [collectionId, getCardsRef]);

    // ✅ TOGGLE OWNERSHIP CARTA
    const toggleCardOwnership = async (card, shouldOwn) => {
        if (!collectionId || !card) return;

        try {
            const cardsRef = getCardsRef();
            const cardRef = doc(cardsRef, card.id);

            if (shouldOwn) {
                // ✅ AGGIUNGI CARTA ALLA COLLEZIONE
                await setDoc(cardRef, {
                    cardId: card.id,
                    name: card.name,
                    setId: card.set?.id || null,
                    setName: card.set?.name || null,
                    rarity: card.rarity || null,
                    number: card.number || card.cardNumber || null,
                    imageUrl: getCardImageUrl(card),
                    owned: true,
                    quantity: 1,
                    condition: 'mint', // Default condition
                    addedAt: new Date(),
                    notes: ''
                });

                toast.success(`${card.name} added to collection! ✨`);
            } else {
                // ✅ RIMUOVI CARTA DALLA COLLEZIONE
                await deleteDoc(cardRef);
                toast.success(`${card.name} removed from collection`);
            }

        } catch (error) {
            console.error('Error toggling card ownership:', error);
            toast.error(`Failed to ${shouldOwn ? 'add' : 'remove'} card: ${error.message}`);
        }
    };

    // ✅ GET IMAGE URL HELPER
    const getCardImageUrl = (card) => {
        if (card.image) {
            return typeof card.image === 'string' ? card.image : card.image.small || card.image.large;
        }
        return card.images?.small || card.images?.large || null;
    };

    // ✅ GET OWNERSHIP STATS
    const getOwnershipStats = (totalCards = 0) => {
        const owned = ownedCards.size;
        const completion = totalCards > 0 ? Math.round((owned / totalCards) * 100) : 0;

        return {
            owned,
            total: totalCards,
            needed: totalCards - owned,
            completion
        };
    };

    // ✅ BULK OPERATIONS
    const addMultipleCards = async (cards) => {
        if (!collectionId || !cards.length) return;

        try {
            const cardsRef = getCardsRef();
            const promises = cards.map(card => {
                const cardRef = doc(cardsRef, card.id);
                return setDoc(cardRef, {
                    cardId: card.id,
                    name: card.name,
                    setId: card.set?.id || null,
                    setName: card.set?.name || null,
                    rarity: card.rarity || null,
                    number: card.number || card.cardNumber || null,
                    imageUrl: getCardImageUrl(card),
                    owned: true,
                    quantity: 1,
                    condition: 'mint',
                    addedAt: new Date(),
                    notes: ''
                });
            });

            await Promise.all(promises);
            toast.success(`${cards.length} cards added to collection! 🎉`);
        } catch (error) {
            console.error('Error adding multiple cards:', error);
            toast.error(`Failed to add cards: ${error.message}`);
        }
    };

    const removeMultipleCards = async (cardIds) => {
        if (!collectionId || !cardIds.length) return;

        try {
            const cardsRef = getCardsRef();
            const promises = cardIds.map(cardId => {
                const cardRef = doc(cardsRef, cardId);
                return deleteDoc(cardRef);
            });

            await Promise.all(promises);
            toast.success(`${cardIds.length} cards removed from collection`);
        } catch (error) {
            console.error('Error removing multiple cards:', error);
            toast.error(`Failed to remove cards: ${error.message}`);
        }
    };

    return {
        ownedCards,
        loading,
        error,
        toggleCardOwnership,
        getOwnershipStats,
        addMultipleCards,
        removeMultipleCards
    };
}

export default useCollectionCards;
