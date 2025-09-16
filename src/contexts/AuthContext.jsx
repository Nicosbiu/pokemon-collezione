// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase'; // ✅ Solo questo import Firebase

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔥 AuthContext: Setting up onAuthStateChanged'); // Debug

        const unsubscribe = onAuthStateChanged(auth,
            (user) => {
                console.log('🔥 AuthContext: Auth state changed', user?.email); // Debug
                setCurrentUser(user);
                setLoading(false);
            },
            (error) => {
                console.error('🔥 AuthContext: Auth error', error); // Debug
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
