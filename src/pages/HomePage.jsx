import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
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
    const { currentUser } = useAuth();
    const [showContent, setShowContent] = useState(false);
    const [hideHero, setHideHero] = useState(false);
    const triggerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry.isIntersecting && !showContent) {
                    console.log('✅ Trigger activated - showing content and hiding hero');
                    setShowContent(true);
                    setHideHero(true); // Nascondi l'hero definitivamente
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => {
            if (triggerRef.current) {
                observer.unobserve(triggerRef.current);
            }
        };
    }, [showContent]);

    useEffect(() => {
        console.log('🎯 Content visibility changed to:', showContent);
    }, [showContent]);

    return (
        <div className="bg-gradient-to-br from-violet-900 to-black text-white">

            {/* Hero Section - con transizione di uscita */}
            <div className={`transition-all duration-1000 ${hideHero
                ? 'h-0 opacity-0 overflow-hidden'
                : 'h-screen opacity-100'
                } flex items-center justify-center relative`}>
                <div className="text-center space-y-8 px-6">
                    <h1 className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Benvenuto
                    </h1>

                    <h2 className="text-2xl md:text-4xl font-semibold text-violet-300">
                        nella tua collezione Pokémon
                    </h2>

                    <p className="text-lg md:text-xl text-violet-400">
                        Ciao {currentUser?.displayName || currentUser?.email}!
                    </p>

                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ELEMENTO TRIGGER */}
            <div
                ref={triggerRef}
                className="h-1 bg-red-500 opacity-0"
            >
            </div>

            {/* DEBUG INFO */}
            {/* <div className="fixed top-20 left-4 bg-black bg-opacity-80 text-white p-4 rounded z-50 text-sm">
                <div>Content: <span className="font-bold">{showContent ? 'VISIBLE' : 'HIDDEN'}</span></div>
            </div> */}

            {/* Header Sticky */}
            <header className={`sticky top-16 bg-violet-900 bg-opacity-95 backdrop-blur-sm z-10 px-6 py-4 transition-all duration-500 transform ${showContent
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
                }`}>
                <h1 className="text-xl font-bold text-purple-400">La tua collezione</h1>
                <p className="text-sm text-violet-300">Ciao {currentUser?.displayName || currentUser?.email}!</p>
            </header>

            {/* Contenuto principale CON PIÙ SPAZIO */}
            <main className={`px-6 pb-8 transition-all duration-1000 ${showContent ? 'pt-24' : 'pt-8'  // Più padding quando header è visibile
                } min-h-screen`}>

                {/* Cards con animazione */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-1000 transform ${showContent
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>

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
                        subtitle="Totale investito"
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

                {/* Azioni Rapide */}
                <section className={`bg-violet-800 bg-opacity-50 rounded-xl p-6 mb-8 transition-all duration-700 delay-300 transform ${showContent
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}>
                    <h2 className="text-2xl font-bold mb-4">Azioni Rapide</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all hover:scale-105">
                            Aggiungi Carta
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all hover:scale-105">
                            Visualizza Pokédex
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all hover:scale-105">
                            Statistiche Dettagliate
                        </button>
                    </div>
                </section>

                {/* SEZIONE EXTRA per aggiungere contenuto */}
                <section className={`bg-violet-800 bg-opacity-30 rounded-xl p-6 mb-8 transition-all duration-1000 delay-500 transform ${showContent
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}>
                    <h2 className="text-2xl font-bold mb-4">Attività Recente</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-violet-700 bg-opacity-50 rounded-lg">
                            <span>Charizard Base Set aggiunto</span>
                            <span className="text-violet-300 text-sm">3 giorni fa</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-violet-700 bg-opacity-50 rounded-lg">
                            <span>Pikachu promo scambiato</span>
                            <span className="text-violet-300 text-sm">1 settimana fa</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-violet-700 bg-opacity-50 rounded-lg">
                            <span>Set Jungle completato</span>
                            <span className="text-violet-300 text-sm">2 settimane fa</span>
                        </div>
                    </div>
                </section>

                {/* ALTRA SEZIONE per ancora più contenuto */}
                <section className={`bg-violet-800 bg-opacity-30 rounded-xl p-6 transition-all duration-1000 delay-700 transform ${showContent
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}>
                    <h2 className="text-2xl font-bold mb-4">Carte più Preziose</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                            <h3 className="font-bold">Charizard 1st Edition</h3>
                            <p className="text-sm opacity-90">Base Set #4</p>
                            <p className="text-lg font-bold mt-2">€2,500</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                            <h3 className="font-bold">Blastoise Base Set</h3>
                            <p className="text-sm opacity-90">Base Set #2</p>
                            <p className="text-lg font-bold mt-2">€450</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                            <h3 className="font-bold">Venusaur Base Set</h3>
                            <p className="text-sm opacity-90">Base Set #15</p>
                            <p className="text-lg font-bold mt-2">€380</p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );

}
