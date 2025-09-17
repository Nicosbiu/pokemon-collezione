// src/contexts/AuthContext.jsx - VERSIONE COMPLETA
import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,      // ✅ Per login
    createUserWithEmailAndPassword,  // ✅ Per registro
    updateProfile                    // ✅ Per aggiornare profilo
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔥 AuthContext: Setting up onAuthStateChanged');

        const unsubscribe = onAuthStateChanged(auth,
            (user) => {
                console.log('🔥 AuthContext: Auth state changed', user?.email);
                setCurrentUser(user);
                setLoading(false);
            },
            (error) => {
                console.error('🔥 AuthContext: Auth error', error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    // ✅ FUNZIONE LOGIN
    const login = async (email, password) => {
        try {
            console.log('🔥 AuthContext: Attempting login for', email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ AuthContext: Login successful', userCredential.user.email);
            return userCredential;
        } catch (error) {
            console.error('❌ AuthContext: Login error:', error);
            throw error;
        }
    };

    // ✅ FUNZIONE SIGNUP
    const signup = async (email, password, displayName) => {
        try {
            console.log('🔥 AuthContext: Attempting signup for', email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Aggiorna il profilo con il nome se fornito
            if (displayName) {
                await updateProfile(userCredential.user, {
                    displayName: displayName
                });
            }

            console.log('✅ AuthContext: Signup successful', userCredential.user.email);
            return userCredential;
        } catch (error) {
            console.error('❌ AuthContext: Signup error:', error);
            throw error;
        }
    };

    // ✅ FUNZIONE LOGOUT
    const logout = async () => {
        try {
            console.log('🔥 AuthContext: Logging out user');
            await signOut(auth);
            console.log('✅ AuthContext: User logged out successfully');
        } catch (error) {
            console.error('❌ AuthContext: Logout error:', error);
            throw error;
        }
    };

    const value = {
        currentUser,
        loading,
        login,    // ✅ Aggiungi login
        signup,   // ✅ Aggiungi signup  
        logout    // ✅ Aggiungi logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
