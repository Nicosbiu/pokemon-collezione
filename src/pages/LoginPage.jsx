// src/pages/LoginPage.jsx - ESEMPIO CORRETTO
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth(); // ✅ Usa login dal context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            console.log('🔥 LoginPage: Submitting login form');

            await login(formData.email, formData.password);

            console.log('✅ LoginPage: Login successful, redirecting...');
            toast.success('Login successful! Welcome back!');
            navigate('/'); // Redirect to home

        } catch (error) {
            console.error('❌ LoginPage: Login failed:', error);

            // ✅ Gestione errori Firebase specifici
            let errorMessage = 'Login failed. Please try again.';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = error.message || 'Login failed. Please try again.';
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-md mx-auto">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/70">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={isLoading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                           rounded-lg px-4 py-3 text-white placeholder-white/50 
                           focus:outline-none focus:border-white/30 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                disabled={isLoading}
                                className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                           rounded-lg px-4 py-3 text-white placeholder-white/50 
                           focus:outline-none focus:border-white/30 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Your password"
                                required
                            />
                        </div>

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
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-6 border-t border-white/10">
                        <p className="text-white/70">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-300 hover:text-purple-200 font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
