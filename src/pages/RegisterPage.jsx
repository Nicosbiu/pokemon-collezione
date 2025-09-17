// src/pages/RegisterPage.jsx - VERSIONE COMPLETA CON TUTTI I CAMPI
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function RegisterPage() {
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        username: '',
        email: '',
        password: '',
        confermaPassword: '',
        sesso: '',
        dataNascita: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    // ✅ VALIDAZIONE COMPLETA PER TUTTI I CAMPI
    const validateForm = () => {
        const newErrors = {};

        // Nome - Obbligatorio, minimo 2 caratteri
        if (!formData.nome.trim()) {
            newErrors.nome = 'Il nome è obbligatorio';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'Il nome deve avere almeno 2 caratteri';
        }

        // Cognome - Obbligatorio, minimo 2 caratteri
        if (!formData.cognome.trim()) {
            newErrors.cognome = 'Il cognome è obbligatorio';
        } else if (formData.cognome.trim().length < 2) {
            newErrors.cognome = 'Il cognome deve avere almeno 2 caratteri';
        }

        // Username - Obbligatorio, minimo 3 caratteri, solo lettere/numeri/_
        if (!formData.username.trim()) {
            newErrors.username = 'L\'username è obbligatorio';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'L\'username deve avere almeno 3 caratteri';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
            newErrors.username = 'L\'username può contenere solo lettere, numeri e underscore';
        }

        // Email - Obbligatoria, formato valido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email è obbligatoria';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Inserisci un indirizzo email valido';
        }

        // Password - Obbligatoria, minimo 6 caratteri
        if (!formData.password) {
            newErrors.password = 'La password è obbligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La password deve avere almeno 6 caratteri';
        }

        // Conferma Password - Obbligatoria, deve corrispondere
        if (!formData.confermaPassword) {
            newErrors.confermaPassword = 'Conferma la tua password';
        } else if (formData.password !== formData.confermaPassword) {
            newErrors.confermaPassword = 'Le password non corrispondono';
        }

        // Sesso - Obbligatorio
        if (!formData.sesso) {
            newErrors.sesso = 'Seleziona il tuo sesso';
        }

        // Data di Nascita - Obbligatoria, validazione età
        if (!formData.dataNascita) {
            newErrors.dataNascita = 'La data di nascita è obbligatoria';
        } else {
            const birthDate = new Date(formData.dataNascita);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (age < 13) {
                newErrors.dataNascita = 'Devi avere almeno 13 anni per registrarti';
            } else if (age > 120) {
                newErrors.dataNascita = 'Inserisci una data di nascita valida';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ MESSAGGI ERRORE FIREBASE IN ITALIANO
    const getFirebaseErrorMessage = (errorCode) => {
        const errorMessages = {
            'auth/email-already-in-use': 'Questa email è già registrata. Prova ad accedere invece.',
            'auth/invalid-email': 'Inserisci un indirizzo email valido.',
            'auth/operation-not-allowed': 'Registrazione non consentita. Contatta il supporto.',
            'auth/weak-password': 'La password è troppo debole. Scegline una più forte.',
            'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
            'auth/network-request-failed': 'Errore di connessione. Controlla la tua connessione internet.',
            'auth/invalid-credential': 'Credenziali non valide. Controlla i tuoi dati.',
            'auth/user-disabled': 'Questo account è stato disabilitato. Contatta il supporto.',
            'auth/quota-exceeded': 'Servizio temporaneamente non disponibile. Riprova più tardi.',
            'auth/timeout': 'Richiesta scaduta. Riprova.',
            'auth/invalid-value-(display-name),-starting-an-object-on-a-scalar-field': 'Formato nome non valido. Inserisci un nome valido.',
            'auth/invalid-display-name': 'Nome non valido. Inserisci un nome valido.'
        };

        return errorMessages[errorCode] || 'Errore durante la registrazione. Riprova.';
    };

    // ✅ GESTIONE CAMBIAMENTO INPUT
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Rimuovi errore quando l'utente inizia a correggere
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // ✅ SUBMIT CON TUTTI I DATI
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione pre-submit
        if (!validateForm()) {
            toast.error('Correggi gli errori evidenziati');
            return;
        }

        let userCreated = false;
        let currentUser = null;

        try {
            setIsLoading(true);
            console.log('🔥 RegisterPage: Inizio registrazione');

            // Pulizia dati form
            const cleanFormData = {
                nome: formData.nome.trim(),
                cognome: formData.cognome.trim(),
                username: formData.username.trim().toLowerCase(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                sesso: formData.sesso,
                dataNascita: formData.dataNascita
            };

            // Nome completo per Firebase displayName
            const displayName = `${cleanFormData.nome} ${cleanFormData.cognome}`;

            console.log('📝 RegisterPage: Dati puliti:', {
                nome: cleanFormData.nome,
                cognome: cleanFormData.cognome,
                username: cleanFormData.username,
                email: cleanFormData.email,
                sesso: cleanFormData.sesso,
                dataNascita: cleanFormData.dataNascita,
                displayName: displayName
            });

            // ✅ TENTATIVO REGISTRAZIONE CON TUTTI I DATI
            const userCredential = await signup(
                cleanFormData.email,
                cleanFormData.password,
                displayName,
                cleanFormData // ✅ Passa tutti i dati aggiuntivi
            );

            userCreated = true;
            currentUser = userCredential.user;

            console.log('✅ RegisterPage: Registrazione completata', {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName
            });

            // ✅ SUCCESSO - Pulisci form e reindirizza
            setFormData({
                nome: '',
                cognome: '',
                username: '',
                email: '',
                password: '',
                confermaPassword: '',
                sesso: '',
                dataNascita: ''
            });

            toast.success(`Benvenuto ${displayName}! Il tuo account è stato creato con successo.`);

            // Reindirizza dopo un breve delay per mostrare il toast
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1500);

        } catch (error) {
            console.error('❌ RegisterPage: Registrazione fallita:', {
                code: error.code,
                message: error.message,
                userCreated: userCreated
            });

            // ✅ GESTIONE ERRORE CON MESSAGGIO UTENTE
            const userErrorMessage = getFirebaseErrorMessage(error.code);

            // Se l'account è stato creato ma c'è stato un errore successivo
            if (userCreated && currentUser) {
                console.log('⚠️ RegisterPage: Account creato ma errore successivo');
                toast.success('Account creato con successo! Puoi ora accedere.');

                // Reindirizza al login dopo delay
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            } else {
                toast.error(userErrorMessage);
            }

            // Imposta errori specifici per i campi se necessario
            if (error.code === 'auth/email-already-in-use') {
                setErrors({ email: 'Questa email è già registrata' });
            } else if (error.code === 'auth/weak-password') {
                setErrors({ password: 'Password troppo debole' });
            } else if (error.code === 'auth/invalid-email') {
                setErrors({ email: 'Formato email non valido' });
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black 
                    pt-36 p-8">
            <div className="max-w-2xl mx-auto"> {/* ✅ Più largo per 2 colonne */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Crea Account</h1>
                        <p className="text-white/70">Unisciti alla community Pokémon Collection</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                        {/* ✅ RIGA 1: NOME E COGNOME */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white placeholder-white/50 focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.nome
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    placeholder="Il tuo nome"
                                    required
                                />
                                {errors.nome && (
                                    <p className="text-red-300 text-sm mt-1">{errors.nome}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Cognome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cognome}
                                    onChange={(e) => handleInputChange('cognome', e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white placeholder-white/50 focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.cognome
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    placeholder="Il tuo cognome"
                                    required
                                />
                                {errors.cognome && (
                                    <p className="text-red-300 text-sm mt-1">{errors.cognome}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ RIGA 2: USERNAME E EMAIL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white placeholder-white/50 focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.username
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    placeholder="username_univoco"
                                    required
                                />
                                {errors.username && (
                                    <p className="text-red-300 text-sm mt-1">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white placeholder-white/50 focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.email
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    placeholder="tua@email.com"
                                    required
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ RIGA 3: PASSWORD E CONFERMA PASSWORD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={isLoading}
                                        className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 pr-12
                               text-white placeholder-white/50 focus:outline-none transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${errors.password
                                                ? 'border-red-400/50 focus:border-red-400/70'
                                                : 'border-white/[0.12] focus:border-white/30'
                                            }`}
                                        placeholder="Minimo 6 caratteri"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-white/70 hover:text-white transition-colors
                             disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Conferma Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confermaPassword}
                                        onChange={(e) => handleInputChange('confermaPassword', e.target.value)}
                                        disabled={isLoading}
                                        className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 pr-12
                               text-white placeholder-white/50 focus:outline-none transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${errors.confermaPassword
                                                ? 'border-red-400/50 focus:border-red-400/70'
                                                : 'border-white/[0.12] focus:border-white/30'
                                            }`}
                                        placeholder="Ripeti la password"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-white/70 hover:text-white transition-colors
                             disabled:opacity-50"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confermaPassword && (
                                    <p className="text-red-300 text-sm mt-1">{errors.confermaPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ RIGA 4: SESSO E DATA DI NASCITA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Sesso *
                                </label>
                                <select
                                    value={formData.sesso}
                                    onChange={(e) => handleInputChange('sesso', e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             [&>option]:bg-gray-800 [&>option]:text-white
                             ${errors.sesso
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    required
                                >
                                    <option value="" className="bg-gray-800 text-white">Seleziona sesso</option>
                                    <option value="maschio" className="bg-gray-800 text-white">Maschio</option>
                                    <option value="femmina" className="bg-gray-800 text-white">Femmina</option>
                                    <option value="altro" className="bg-gray-800 text-white">Altro</option>
                                </select>
                                {errors.sesso && (
                                    <p className="text-red-300 text-sm mt-1">{errors.sesso}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Data di Nascita *
                                </label>
                                <input
                                    type="date"
                                    value={formData.dataNascita}
                                    onChange={(e) => handleInputChange('dataNascita', e.target.value)}
                                    disabled={isLoading}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]}
                                    className={`w-full backdrop-blur-xl bg-white/[0.08] border rounded-lg px-4 py-3 
                             text-white focus:outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.dataNascita
                                            ? 'border-red-400/50 focus:border-red-400/70'
                                            : 'border-white/[0.12] focus:border-white/30'
                                        }`}
                                    required
                                />
                                {errors.dataNascita && (
                                    <p className="text-red-300 text-sm mt-1">{errors.dataNascita}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ PULSANTE SUBMIT */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                         border border-purple-400/30 text-white rounded-lg py-3 px-4 
                         hover:from-purple-500/40 hover:to-pink-500/40 
                         hover:border-purple-400/50 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creazione account...
                                </>
                            ) : (
                                'Crea Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-6 border-t border-white/10">
                        <p className="text-white/70">
                            Hai già un account?{' '}
                            <Link
                                to="/login"
                                className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                            >
                                Accedi qui
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
