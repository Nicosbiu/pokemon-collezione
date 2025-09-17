// src/hooks/useCollection.js - Hook personalizzato per gestire collezione singola
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useCollection() {
    const { collectionId } = useParams();
    const { currentUser } = useAuth();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (!collectionId || !currentUser) {
            setLoading(false);
            return;
        }

        console.log('🔍 useCollection: Loading collection', collectionId);

        // ✅ Setup real-time listener per la collezione
        const unsubscribe = onSnapshot(
            doc(db, 'collections', collectionId),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const collectionData = {
                        id: docSnapshot.id,
                        ...docSnapshot.data()
                    };

                    console.log('📄 useCollection: Collection loaded', collectionData);

                    // ✅ Verifica se l'utente ha accesso alla collezione
                    const userMembership = collectionData.members?.[currentUser.uid];

                    if (userMembership) {
                        setCollection(collectionData);
                        setHasAccess(true);
                        setError(null);
                    } else {
                        setError('You do not have access to this collection');
                        setHasAccess(false);
                        setCollection(null);
                    }
                } else {
                    console.log('❌ useCollection: Collection not found');
                    setError('Collection not found');
                    setCollection(null);
                    setHasAccess(false);
                }

                setLoading(false);
            },
            (error) => {
                console.error('❌ useCollection: Error loading collection:', error);
                setError('Error loading collection: ' + error.message);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [collectionId, currentUser]);

    // ✅ Funzioni helper per la collezione
    const isOwner = collection?.members?.[currentUser?.uid]?.role === 'owner';
    const canEdit = collection?.members?.[currentUser?.uid]?.canEdit === true;
    const userRole = collection?.members?.[currentUser?.uid]?.role || 'viewer';

    return {
        collection,
        loading,
        error,
        hasAccess,
        isOwner,
        canEdit,
        userRole,
        collectionId
    };
}
