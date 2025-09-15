import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
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

    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        // AGGIUNGI QUESTA VALIDAZIONE
        if (!passwordMatch) {
            setError('Le password non coincidono');
            return;
        }

        // Validazione data di nascita (già esistente)
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

        setIsSubmitting(true); // AGGIUNGI QUESTA RIGA

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
            setIsSubmitting(false); // AGGIUNGI QUESTA RIGA
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-black text-white p-6">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#7c3aed',
                        color: '#fff',
                    },
                }}
            />

            <form onSubmit={handleSubmit} className="bg-violet-800 bg-opacity-70 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Crea un nuovo account</h2>
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                {/* Riga 1: Nome e Cognome */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="nome" className="block text-violet-300 mb-1 font-semibold">Nome</label>
                        <input type="text" id="nome" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <div>
                        <label htmlFor="cognome" className="block text-violet-300 mb-1 font-semibold">Cognome</label>
                        <input type="text" id="cognome" placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                {/* Riga 2: Username e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="username" className="block text-violet-300 mb-1 font-semibold">Username</label>
                        <input type="text" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-violet-300 mb-1 font-semibold">Email</label>
                        <input type="email" id="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>

                {/* Riga 3: Password e Conferma Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <PasswordInput value={password} onChange={handlePasswordChange} />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-violet-300 mb-1 font-semibold">
                            Conferma Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Ripeti la password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 ${passwordMatch ? 'focus:ring-purple-500' : 'focus:ring-red-500 border border-red-400'
                                }`}
                        />

                        {confirmPassword && (
                            <div className={`text-sm mt-1 ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordMatch ? '✅ Le password coincidono' : '❌ Le password non coincidono'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Riga 4: Data di nascita e Sesso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="dataNascita" className="block text-violet-300 mb-1 font-semibold">Data di nascita</label>
                        <input type="date" id="dataNascita" name="dataNascita" value={dataNascita} onChange={e => setDataNascita(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>

                    <div>
                        <label htmlFor="sesso" className="block text-violet-300 mb-1 font-semibold">Sesso</label>
                        <select id="sesso" value={sesso} onChange={e => setSesso(e.target.value)}
                            className="w-full p-3 rounded-md bg-violet-900 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Seleziona</option>
                            <option value="Maschio">Maschio</option>
                            <option value="Femmina">Femmina</option>
                            <option value="Altro">Altro</option>
                        </select>
                    </div>
                </div>

                {/* Pulsante submit */}
                <button
                    type="submit"
                    disabled={isSubmitting || !passwordMatch}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-3 rounded-md font-semibold hover:from-purple-700 hover:to-purple-500 transition text-white disabled:opacity-50"
                >
                    {isSubmitting ? 'Creazione account...' : 'Registrati'}
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
