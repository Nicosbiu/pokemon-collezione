// src/components/LandingPage.jsx
import { Link } from 'react-router-dom';
import {
    SparklesIcon,
    RectangleGroupIcon,
    ShareIcon,
    ChartBarSquareIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

function LandingPage() {
    const features = [
        {
            icon: <RectangleGroupIcon className="w-8 h-8" />,
            title: "Virtual Binder",
            description: "Organize your Pokémon cards in beautiful digital collections"
        },
        {
            icon: <ShareIcon className="w-8 h-8" />,
            title: "Share & Collaborate",
            description: "Share collections with friends and build together"
        },
        {
            icon: <ChartBarSquareIcon className="w-8 h-8" />,
            title: "Track Progress",
            description: "Monitor completion rates and collection statistics"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-8">

                {/* Main Hero */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                            backdrop-blur-sm border border-white/10">
                            <SparklesIcon className="w-16 h-16 text-purple-300" />
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            PokéCollection
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
                        The modern way to organize, track, and share your Pokémon TCG collections.
                        Build your virtual binder and never lose track of your cards again.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                         border border-purple-400/30 text-white rounded-xl py-4 px-8 
                         hover:from-purple-500/40 hover:to-pink-500/40 
                         hover:border-purple-400/50 transition-all duration-200
                         flex items-center gap-3 text-lg font-semibold
                         hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            Get Started Free
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>

                        <Link
                            to="/login"
                            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         text-white/90 rounded-xl py-4 px-8 
                         hover:bg-white/15 hover:border-white/25 
                         transition-all duration-200 text-lg font-semibold"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div key={index}
                            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                            rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 
                            transition-all duration-300 text-center group">

                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                border border-white/10 text-purple-300
                                group-hover:from-purple-500/30 group-hover:to-pink-500/30 
                                group-hover:border-white/20 transition-all duration-300">
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-white/70 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional CTA Section */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to organize your collection?
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of collectors who trust PokéCollection to manage their cards.
                        Start building your virtual binder today.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                       border border-purple-400/30 text-white rounded-xl py-4 px-8 
                       hover:from-purple-500/40 hover:to-pink-500/40 
                       hover:border-purple-400/50 transition-all duration-200
                       text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25"
                    >
                        Create Your First Collection
                        <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
