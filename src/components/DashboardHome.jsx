// src/components/DashboardHome.jsx - Salva le tue card esistenti
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatCard from './StatCard';
import { collectionsService } from '../services/firebase';

function DashboardHome() {
    const { currentUser } = useAuth();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadUserData();
        }
    }, [currentUser]);

    const loadUserData = async () => {
        try {
            const userCollections = await collectionsService.getUserCollections(currentUser.uid);
            setCollections(userCollections);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                          rounded-2xl p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 
                            border-white mx-auto"></div>
                        <p className="text-white/70 mt-4">Loading your data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Welcome Hero */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0]}! 👋
                    </h1>
                    <p className="text-white/70 text-lg">
                        Ready to manage your Pokémon collection? You have {collections.length} collection(s).
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Collections"
                        value={collections.length}
                        subtitle="Active collections"
                        gradientFrom="from-blue-500/30"
                        gradientTo="to-cyan-500/30"
                    />
                    <StatCard
                        title="Total Cards"
                        value="0" // TODO: Calculate from collections
                        subtitle="Cards in collection"
                        gradientFrom="from-green-500/30"
                        gradientTo="to-emerald-500/30"
                    />
                    <StatCard
                        title="Completion"
                        value="0%"
                        subtitle="Average completion"
                        gradientFrom="from-purple-500/30"
                        gradientTo="to-pink-500/30"
                    />
                    <StatCard
                        title="Recent Activity"
                        value="0"
                        subtitle="Cards added this week"
                        gradientFrom="from-orange-500/30"
                        gradientTo="to-red-500/30"
                    />
                </div>

                {/* Quick Actions */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link
                            to="/collections"
                            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-xl p-6 hover:bg-white/15 hover:border-white/25 
                         transition-all duration-200 text-center"
                        >
                            <h3 className="text-white font-semibold mb-2">View Collections</h3>
                            <p className="text-white/70 text-sm">Manage your card collections</p>
                        </Link>

                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                           rounded-xl p-6 opacity-50 text-center">
                            <h3 className="text-white font-semibold mb-2">Add Cards</h3>
                            <p className="text-white/70 text-sm">Coming soon...</p>
                        </div>

                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                           rounded-xl p-6 opacity-50 text-center">
                            <h3 className="text-white font-semibold mb-2">View Statistics</h3>
                            <p className="text-white/70 text-sm">Coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;
