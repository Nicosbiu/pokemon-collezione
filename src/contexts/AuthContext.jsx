import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Aggiunto updateProfile
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    async function signup(email, password, additionalData) {
        try {
            console.log('AuthContext: Inizio signup');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User autenticato?', !!user);
            console.log('AuthContext: Utente creato', user.uid);

            // Aggiorna displayName
            if (additionalData?.nome) {
                await updateProfile(user, { displayName: additionalData.nome });
                console.log('AuthContext: DisplayName aggiornato');
            }

            // Salva dati aggiuntivi in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email,
                ...additionalData,
                createdAt: new Date()
            });
            console.log('AuthContext: Dati salvati in Firestore');

            return userCredential;
        } catch (error) {
            console.error('AuthContext: Errore in signup:', error);
            throw error; // Importante: re-throw l'errore
        }
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
