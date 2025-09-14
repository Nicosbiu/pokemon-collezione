import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Errore logout', error);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-violet-900 to-black text-white p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Benvenuto nella tua collezione Pokémon</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-purple-600 to-purple-400 px-4 py-2 rounded-md font-semibold hover:from-purple-700 hover:to-purple-500 transition"
                >
                    Logout
                </button>
            </header>
            <p>Qui potrai vedere le statistiche e il pokédex.</p>
        </div>
    );
}
