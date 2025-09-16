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
                    setShowContent(true);
                    setHideHero(true);
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

    return (
        <div className="bg-gradient-to-br from-violet-900 to-black text-white">

            {/* Hero Section */}
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

                    <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${showContent ? 'opacity-0' : 'opacity-100 animate-bounce'
                        }`}>
                        <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Elemento trigger */}
            <div
                ref={triggerRef}
                className="h-1 bg-red-500 opacity-0"
            >
            </div>

            {/* Solo le Card - Niente header, niente sezioni extra */}
            <main className={`px-6 pb-16 min-h-screen transition-all duration-1000 ${showContent ? 'pt-32' : 'pt-8'
                }`}>

                {/* Grid con più spazio */}
                <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto transition-all duration-1000 transform ${showContent
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

            </main>
        </div>
    );
}
