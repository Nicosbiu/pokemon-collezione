// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // ✅ Importa signOut
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
        logout // ✅ Includi logout nel context
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
