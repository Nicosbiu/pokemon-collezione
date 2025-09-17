// src/components/Navbar.jsx - Versione Glass moderna con Collections
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
    HomeIcon,
    FolderIcon,          // ✅ Cambiato da RectangleStackIcon
    PlusIcon,
    ChartBarIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Errore nel logout:', error);
        }
    };

    // ✅ AGGIORNATO: Collections invece di Pokédex
    const navItems = [
        { path: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
        { path: '/collections', label: 'Collections', icon: <FolderIcon className="w-5 h-5" /> }, // ✅ CAMBIATO
        { path: '/add-card', label: 'Aggiungi', icon: <PlusIcon className="w-5 h-5" /> },
        { path: '/stats', label: 'Stats', icon: <ChartBarIcon className="w-5 h-5" /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            {/* Container glass effect */}
            <div className="max-w-7xl mx-auto">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl px-6 py-4 shadow-lg shadow-black/10">

                    {/* Gradient overlay sottile */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none"></div>

                    <div className="relative flex items-center justify-between">

                        {/* Logo/Brand */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">P</span>
                            </div>
                            <span className="text-lg font-semibold text-white/90 hidden sm:block">PokéCollection</span>
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${location.pathname === item.path
                                            ? 'bg-white/15 text-white border border-white/20 shadow-lg shadow-purple-500/10'
                                            : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center space-x-3">
                            {currentUser ? (
                                <div className="flex items-center space-x-3">
                                    {/* User info */}
                                    <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center">
                                            <UserIcon className="w-4 h-4 text-white/80" />
                                        </div>
                                        <span className="text-sm text-white/80">
                                            {currentUser.displayName || currentUser.email}
                                        </span>
                                    </div>

                                    {/* Logout button */}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/20 hover:border-red-500/30 text-red-300 hover:text-red-200 transition-all duration-300 text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border border-white/20 text-white transition-all duration-300 text-sm font-medium"
                                    >
                                        Registrati
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white transition-colors duration-300"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-5 h-5" />
                            ) : (
                                <Bars3Icon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                                                ? 'bg-white/15 text-white border border-white/20'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}

                                {/* Mobile user section */}
                                {currentUser ? (
                                    <div className="pt-4 border-t border-white/10 space-y-2">
                                        <div className="px-4 py-2 text-white/60 text-sm">
                                            {currentUser.displayName || currentUser.email}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/20 text-red-300 transition-all duration-300"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-white/10 space-y-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 transition-all duration-300"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 text-white transition-all duration-300"
                                        >
                                            Registrati
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
