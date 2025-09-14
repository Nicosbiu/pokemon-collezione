import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/', { replace: true }); // Redirect a homepage
        } catch {
            setError('Credenziali non valide');
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-violet-900 to-black text-white p-6">
            <form onSubmit={handleSubmit} className="bg-violet-800 bg-opacity-70 rounded-xl shadow-lg p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Accedi al tuo account</h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <input type="email" placeholder="Email" className="w-full p-3 rounded-md mb-4 bg-violet-900 placeholder-violet-300 focus:outline-none"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full p-3 rounded-md mb-6 bg-violet-900 placeholder-violet-300 focus:outline-none"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-3 rounded-md font-semibold hover:from-purple-700 hover:to-purple-500 transition">
                    Accedi
                </button>
                <p className="mt-4 text-center text-sm text-violet-300">
                    Non hai un account?{' '}
                    <Link to="/register" className="underline hover:text-purple-400">
                        Registrati qui
                    </Link>
                </p>
            </form>
        </div>
    );
}
