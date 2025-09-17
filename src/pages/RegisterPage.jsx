// RegisterPage.jsx - Versione glass moderna
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [username, setUsername] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [sesso, setSesso] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { signup } = useAuth();
    const navigate = useNavigate();

    const checkPasswordMatch = (pwd, confirmPwd) => {
        const match = pwd === confirmPwd;
        setPasswordMatch(match);
        return match;
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        checkPasswordMatch(value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        checkPasswordMatch(password, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!passwordMatch) {
            setError('Le password non coincidono');
            return;
        }

        if (!dataNascita) {
            setError('Per favore inserisci la data di nascita');
            return;
        }

        const today = new Date();
        const dob = new Date(dataNascita);
        if (dob > today) {
            setError('La data di nascita non può essere nel futuro');
            return;
        }

        setIsSubmitting(true);

        try {
            const loadingToast = toast.loading('Creazione account in corso...');

            await signup(email, password, { nome, cognome, username, dataNascita, sesso });

            toast.dismiss(loadingToast);
            toast.success(`Benvenuto ${nome}! La tua collezione ti aspetta!`, {
                duration: 3000,
                icon: '🎉',
            });

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1500);

        } catch (err) {
            toast.error('Errore nella registrazione: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-black text-white pt-32 p-8">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        borderRadius: '1rem',
                    },
                }}
            />

            {/* Card container glass - più largo per i campi */}
            <div className="w-full max-w-2xl">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl p-8 shadow-2xl shadow-black/20">

                    {/* Gradient overlay sottile */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">P</span>
                            </div>
                            <h2 className="text-2xl font-light text-white/90 mb-2">Crea il tuo account</h2>
                            <p className="text-sm text-white/60">Inizia la tua collezione Pokémon</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                <p className="text-red-300 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Riga 1: Nome e Cognome */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nome" className="block text-white/80 mb-2 text-sm font-medium">Nome</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        placeholder="Nome"
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cognome" className="block text-white/80 mb-2 text-sm font-medium">Cognome</label>
                                    <input
                                        type="text"
                                        id="cognome"
                                        placeholder="Cognome"
                                        value={cognome}
                                        onChange={e => setCognome(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Riga 2: Username e Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="username" className="block text-white/80 mb-2 text-sm font-medium">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-white/80 mb-2 text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Riga 3: Password e Conferma Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-white/80 mb-2 text-sm font-medium">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="w-full p-4 pr-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200 p-1"
                                        >
                                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-white/80 mb-2 text-sm font-medium">Conferma Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            placeholder="Ripeti la password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            className={`w-full p-4 pr-12 rounded-2xl bg-white/5 backdrop-blur-sm border placeholder-white/40 text-white focus:outline-none focus:ring-2 transition-all duration-200 ${passwordMatch ? 'border-white/10 focus:ring-purple-500/50 focus:border-white/20' : 'border-red-500/40 focus:ring-red-500/50'
                                                }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200 p-1"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {confirmPassword && (
                                        <div className={`text-sm mt-2 ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}>
                                            {passwordMatch ? '✅ Le password coincidono' : '❌ Le password non coincidono'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Riga 4: Data di nascita e Sesso */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="dataNascita" className="block text-white/80 mb-2 text-sm font-medium">Data di nascita</label>
                                    <input
                                        type="date"
                                        id="dataNascita"
                                        value={dataNascita}
                                        onChange={e => setDataNascita(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sesso" className="block text-white/80 mb-2 text-sm font-medium">Sesso</label>
                                    <select
                                        id="sesso"
                                        value={sesso}
                                        onChange={e => setSesso(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200 [&>option]:bg-violet-900 [&>option]:text-white [&>option]:py-2"
                                        required
                                    >
                                        <option value="" className="bg-violet-900 text-white/60">Seleziona</option>
                                        <option value="Maschio" className="bg-violet-900 text-white">Maschio</option>
                                        <option value="Femmina" className="bg-violet-900 text-white">Femmina</option>
                                        <option value="Altro" className="bg-violet-900 text-white">Altro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !passwordMatch}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border border-white/20 hover:border-white/30 text-white font-medium transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creazione account...</span>
                                    </div>
                                ) : (
                                    'Registrati'
                                )}
                            </button>

                            {/* Link login */}
                            <div className="text-center pt-4 border-t border-white/10">
                                <p className="text-sm text-white/60">
                                    Hai già un account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                                    >
                                        Accedi qui
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Floating elements per depth */}
                        <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-400/6 to-transparent rounded-full blur-xl opacity-40"></div>
                        <div className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-pink-400/4 to-transparent rounded-full blur-lg opacity-30"></div>
                        <div className="absolute top-1/3 left-12 w-8 h-8 bg-gradient-to-br from-violet-400/5 to-transparent rounded-full blur-md opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
