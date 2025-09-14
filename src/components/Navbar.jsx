// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Errore logout', error);
        }
    };

    const activeClass = "text-purple-400 font-semibold border-b-2 border-purple-400";

    return (
        <nav className="bg-violet-900 bg-opacity-90 backdrop-blur-md fixed top-0 w-full z-50 shadow-md">
            <div className="w-full px-3">
                <div className="flex h-16 items-center justify-between">
                    {/* Nome sito a sinistra */}
                    <div>
                        <Link to="/" className="text-white font-bold text-xl">
                            CarDex
                        </Link>
                    </div>
                    {/* Link navigazione centrati */}
                    <div className="flex space-x-8 justify-center flex-grow">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? activeClass : "text-violet-300 hover:text-purple-400"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/pokedex"
                            className={({ isActive }) =>
                                isActive ? activeClass : "text-violet-300 hover:text-purple-400"
                            }
                        >
                            Pokédex
                        </NavLink>
                    </div>
                    {/* Pulsante logout a destra */}
                    <div>
                        <button
                            onClick={handleLogout}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

    );
}
