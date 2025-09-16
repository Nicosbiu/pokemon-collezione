import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
    const { currentUser, loading } = useAuth();

    // ✅ Mostra loading mentre Firebase controlla l'auth
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black 
                      flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 
                          border-white mx-auto"></div>
                    <p className="text-white/70 mt-4 text-center">Loading...</p>
                </div>
            </div>
        );
    }

    // ✅ Redirect se non autenticato
    return currentUser ? children : <Navigate to="/login" />;
}

export default RequireAuth;
