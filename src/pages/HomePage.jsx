import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/StatCard';
import {
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
    const { logout, currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Errore logout', error);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-violet-900 to-black text-white p-6 pt-16">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Benvenuto nella tua collezione
                    </h1>
                    <p className="text-violet-300 mt-2">Ciao {currentUser?.displayName || currentUser?.email}!</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Carte Mancanti"
                    value="47"
                    subtitle="Per completare il set base"
                    icon={<ClipboardDocumentListIcon className="w-6 h-6 text-violet-400" />}
                    trend={{ positive: false, value: '-2 rispetto al mese scorso' }}
                />

                <StatCard
                    title="Carte Aggiunte"
                    value="12"
                    subtitle="Nell'ultimo mese"
                    icon={<PlusCircleIcon className="w-6 h-6 text-violet-400" />}
                    trend={{ positive: true, value: '+5 rispetto al mese scorso' }}
                />

                <StatCard
                    title="Progresso"
                    value="85%"
                    subtitle="Collezione completata"
                    icon={<CheckCircleIcon className="w-6 h-6 text-violet-400" />}
                />

                <StatCard
                    title="Soldi Spesi"
                    value="€120"
                    subtitle="Totale investito nella collezione"
                    icon={<CurrencyDollarIcon className="w-6 h-6 text-violet-400" />}
                />

                <StatCard
                    title="Valore Stimato"
                    value="€450"
                    subtitle="Basato sui prezzi attuali"
                    icon={<ArrowTrendingUpIcon className="w-6 h-6 text-violet-400" />}
                />

                <StatCard
                    title="Ultima Attività"
                    value="3 giorni fa"
                    subtitle="Charizard aggiunto"
                    icon={<ClockIcon className="w-6 h-6 text-violet-400" />}
                />
            </div>

            <div className="bg-violet-800 bg-opacity-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Azioni Rapide</h2>
                <div className="flex gap-4">
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                        Aggiungi Carta
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                        Visualizza Pokédex
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                        Statistiche Dettagliate
                    </button>
                </div>
            </div>
        </div>
    );
}
