// src/contexts/AuthContext.jsx - VERSIONE CORRETTA PER VITE
import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// ✅ CREA CONTEXT FUORI DAL COMPONENTE
const AuthContext = createContext();

// ✅ HOOK PERSONALIZZATO - ESPORTA DOPO LA DEFINIZIONE
function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// ✅ COMPONENTE PROVIDER
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        console.log('🔥 AuthContext: Setting up onAuthStateChanged');

        const unsubscribe = onAuthStateChanged(auth,
            async (user) => {
                console.log('🔥 AuthContext: Auth state changed', user?.email);
                setCurrentUser(user);

                // ✅ Carica profilo completo da Firestore se utente loggato
                if (user) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            setUserProfile(userDoc.data());
                            console.log('✅ AuthContext: User profile loaded from Firestore');
                        }
                    } catch (error) {
                        console.error('❌ AuthContext: Error loading user profile:', error);
                    }
                } else {
                    setUserProfile(null);
                }

                setLoading(false);
            },
            (error) => {
                console.error('🔥 AuthContext: Auth error', error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    // ✅ FUNZIONE PER SALVARE UTENTE IN FIRESTORE
    const saveUserToFirestore = async (uid, userData) => {
        try {
            console.log('🔥 AuthContext: Saving user data to Firestore', uid);

            const userDocData = {
                // ✅ Dati di autenticazione
                uid: uid,
                email: userData.email,

                // ✅ Dati personali
                nome: userData.nome,
                cognome: userData.cognome,
                username: userData.username,
                sesso: userData.sesso,
                dataNascita: userData.dataNascita,

                // ✅ Metadati
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),

                // ✅ Impostazioni utente (valori default)
                preferences: {
                    theme: 'dark',
                    language: 'it',
                    notifications: {
                        email: true,
                        push: true,
                        collections: true
                    }
                },

                // ✅ Stats utente (valori iniziali)
                stats: {
                    totalCollections: 0,
                    totalCards: 0,
                    favoriteGame: 'pokemon'
                },

                // ✅ Status account
                isActive: true,
                isVerified: false,
                role: 'user'
            };

            // ✅ Salva nel documento users/{uid}
            await setDoc(doc(db, 'users', uid), userDocData);

            console.log('✅ AuthContext: User data saved to Firestore successfully');
            setUserProfile(userDocData);

            return userDocData;
        } catch (error) {
            console.error('❌ AuthContext: Error saving user to Firestore:', error);
            throw error;
        }
    };

    // ✅ FUNZIONE LOGIN
    const login = async (email, password) => {
        try {
            console.log('🔥 AuthContext: Attempting login for', email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // ✅ Aggiorna lastLoginAt
            try {
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    lastLoginAt: serverTimestamp()
                }, { merge: true });
            } catch (error) {
                console.error('❌ AuthContext: Error updating lastLoginAt:', error);
                // Non fallire il login per questo errore
            }

            console.log('✅ AuthContext: Login successful', userCredential.user.email);
            return userCredential;
        } catch (error) {
            console.error('❌ AuthContext: Login error:', error);
            throw error;
        }
    };

    // ✅ FUNZIONE SIGNUP COMPLETA
    const signup = async (email, password, displayName, additionalData) => {
        let userCredential = null;

        try {
            console.log('🔥 AuthContext: Attempting signup for', email);
            console.log('📝 AuthContext: Additional data:', additionalData);

            // ✅ Validazione input
            if (!email || !password) {
                throw new Error('Email e password sono obbligatorie');
            }

            if (!displayName || typeof displayName !== 'string') {
                throw new Error('Nome completo valido è obbligatorio');
            }

            if (!additionalData || !additionalData.nome || !additionalData.cognome || !additionalData.username) {
                throw new Error('Tutti i campi sono obbligatori');
            }

            // ✅ Controlla se username è già in uso
            const usernameCheck = await checkUsernameAvailable(additionalData.username);
            if (!usernameCheck) {
                const error = new Error('Username già in uso');
                error.code = 'auth/username-already-in-use';
                throw error;
            }

            // ✅ Step 1: Crea account Firebase Auth
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('✅ AuthContext: User account created', userCredential.user.uid);

            // ✅ Step 2: Aggiorna profilo Firebase con displayName
            await updateProfile(userCredential.user, {
                displayName: displayName.trim()
            });
            console.log('✅ AuthContext: Firebase profile updated with displayName:', displayName);

            // ✅ Step 3: Salva tutti i dati in Firestore
            const userData = {
                email: email.toLowerCase(),
                nome: additionalData.nome,
                cognome: additionalData.cognome,
                username: additionalData.username.toLowerCase(),
                sesso: additionalData.sesso,
                dataNascita: additionalData.dataNascita
            };

            await saveUserToFirestore(userCredential.user.uid, userData);

            // ✅ Step 4: Ricarica user per ottenere profilo aggiornato
            await userCredential.user.reload();
            console.log('✅ AuthContext: User profile reloaded');

            console.log('✅ AuthContext: Signup process completed successfully');
            return userCredential;

        } catch (error) {
            console.error('❌ AuthContext: Signup error:', {
                code: error.code,
                message: error.message,
                accountCreated: !!userCredential
            });

            // ✅ Se l'account Firebase è stato creato ma errore Firestore, 
            // l'utente può comunque fare login
            const enhancedError = new Error(error.message);
            enhancedError.code = error.code;
            enhancedError.accountCreated = !!userCredential;
            enhancedError.user = userCredential?.user || null;

            throw enhancedError;
        }
    };

    // ✅ FUNZIONE PER CONTROLLARE USERNAME DISPONIBILE
    const checkUsernameAvailable = async (username) => {
        try {
            // TODO: Implementa controllo username in collezione separata o query
            // Per ora restituisce sempre true, ma dovresti implementare una collezione 'usernames'
            console.log('🔍 AuthContext: Checking username availability:', username);

            // Implementazione semplificata - in produzione usa una collezione dedicata
            return true;
        } catch (error) {
            console.error('❌ AuthContext: Error checking username:', error);
            return false;
        }
    };

    // ✅ FUNZIONE LOGOUT
    const logout = async () => {
        try {
            console.log('🔥 AuthContext: Logging out user');

            // ✅ Pulisci stato locale
            setUserProfile(null);

            await signOut(auth);
            console.log('✅ AuthContext: User logged out successfully');
        } catch (error) {
            console.error('❌ AuthContext: Logout error:', error);
            throw error;
        }
    };

    // ✅ FUNZIONE PER AGGIORNARE PROFILO UTENTE
    const updateUserProfile = async (updates) => {
        if (!currentUser) {
            throw new Error('Utente non autenticato');
        }

        try {
            console.log('🔥 AuthContext: Updating user profile:', updates);

            // ✅ Aggiorna Firestore
            await setDoc(doc(db, 'users', currentUser.uid), {
                ...updates,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // ✅ Aggiorna stato locale
            setUserProfile(prev => ({
                ...prev,
                ...updates,
                updatedAt: new Date()
            }));

            console.log('✅ AuthContext: User profile updated successfully');
        } catch (error) {
            console.error('❌ AuthContext: Error updating profile:', error);
            throw error;
        }
    };

    // ✅ VALORE DEL CONTEXT
    const value = {
        currentUser,
        userProfile,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        checkUsernameAvailable
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ✅ ESPORTA ALLA FINE - COMPATIBILE CON VITE FAST REFRESH
export { useAuth, AuthProvider };
