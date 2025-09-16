// LoginPage.jsx - Versione glass moderna
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const loadingToast = toast.loading('Accesso in corso...');
            await login(email, password);

            toast.dismiss(loadingToast);
            toast.success('Benvenuto!', {
                duration: 2000,
                icon: '🎉',
            });

            navigate('/', { replace: true });
        } catch (err) {
            toast.error('Errore nel login: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-black text-white p-6">
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

            {/* Card container con effetto glass */}
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl p-8 shadow-2xl shadow-black/20">

                    {/* Gradient overlay sottile */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">P</span>
                            </div>
                            <h2 className="text-2xl font-light text-white/90 mb-2">Bentornato</h2>
                            <p className="text-sm text-white/60">Accedi alla tua collezione Pokémon</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                <p className="text-red-300 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-white/80 mb-2 text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="La tua email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Password Field con occhietto */}
                            <div>
                                <label htmlFor="password" className="block text-white/80 mb-2 text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="La tua password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-4 pr-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/20 transition-all duration-200"
                                        required
                                    />

                                    {/* Pulsante occhietto */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200 p-1"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border border-white/20 hover:border-white/30 text-white font-medium transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Accesso...</span>
                                    </div>
                                ) : (
                                    'Accedi'
                                )}
                            </button>

                            {/* Link registrazione */}
                            <div className="text-center pt-4 border-t border-white/10">
                                <p className="text-sm text-white/60">
                                    Non hai un account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                                    >
                                        Registrati qui
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Floating elements per depth */}
                        <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-purple-400/8 to-transparent rounded-full blur-lg opacity-50"></div>
                        <div className="absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-br from-pink-400/5 to-transparent rounded-full blur-md opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
