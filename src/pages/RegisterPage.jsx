import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput.jsx';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [username, setUsername] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [sesso, setSesso] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validazione data di nascita
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
        // Puoi aggiungere controlli extra tipo età minima

        try {
            await signup(email, password, { nome, cognome, username, dataNascita, sesso });
            navigate('/', { replace: true });
        } catch (err) {
            setError('Errore nella registrazione: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-black text-white p-6">
            <form onSubmit={handleSubmit} className="bg-violet-800 bg-opacity-70 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Crea un nuovo account</h2>
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="nome" className="block text-violet-300 mb-1 font-semibold">Nome</label>
                    <input type="text" id="nome" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="mb-4">
                    <label htmlFor="cognome" className="block text-violet-300 mb-1 font-semibold">Cognome</label>
                    <input type="text" id="cognome" placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-violet-300 mb-1 font-semibold">Username</label>
                    <input type="text" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-violet-300 mb-1 font-semibold">Email</label>
                    <input type="email" id="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="mb-4">
                    <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataNascita" className="block text-violet-300 mb-1 font-semibold">Data di nascita</label>
                    <input type="date" id="dataNascita" name="dataNascita" value={dataNascita} onChange={e => setDataNascita(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="mb-6">
                    <label htmlFor="sesso" className="block text-violet-300 mb-1 font-semibold">Sesso</label>
                    <select id="sesso" value={sesso} onChange={e => setSesso(e.target.value)}
                        className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Seleziona</option>
                        <option value="Maschio">Maschio</option>
                        <option value="Femmina">Femmina</option>
                        <option value="Altro">Altro</option>
                    </select>
                </div>

                <button type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-3 rounded-md font-semibold hover:from-purple-700 hover:to-purple-500 transition text-white">
                    Registrati
                </button>

                <p className="mt-4 text-center text-sm text-violet-300">
                    Hai già un account?{' '}
                    <Link to="/login" className="underline hover:text-purple-400">
                        Accedi qui
                    </Link>
                </p>
            </form>

        </div>
    );
}
