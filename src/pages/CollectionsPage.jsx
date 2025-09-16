// src/pages/CollectionsPage.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateCollectionModal from '../components/CreateCollectionModal';
import { PlusIcon } from '@heroicons/react/24/outline';

function CollectionsPage() {
    const { currentUser, loading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateCollection = (collectionData) => {
        console.log('🎯 Creating collection:', collectionData);
        // TODO: Implementare creazione su Firestore
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black p-8">
            {/* Header */}
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-white text-3xl font-bold mb-2">
                            Your Collections ⚡
                        </h1>
                        <p className="text-white/70">
                            Welcome back, {currentUser?.email}!
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                       border border-purple-400/30 text-white rounded-lg py-3 px-6 
                       hover:from-purple-500/40 hover:to-pink-500/40 
                       hover:border-purple-400/50 transition-all duration-200
                       flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Collection
                    </button>
                </div>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Collection Card */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 
                        transition-all duration-200">
                    <h3 className="text-white text-lg font-semibold mb-2">
                        Sample Collection
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                        This is a placeholder collection. Create your first one!
                    </p>
                    <div className="flex justify-between items-center text-white/50 text-sm">
                        <span>0 cards</span>
                        <span>Pokémon TCG</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateCollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCollection}
            />
        </div>
    );
}

export default CollectionsPage;
