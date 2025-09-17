// src/pages/CollectionDetailPage.jsx - Pagina principale collezione
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import CollectionHeader from '../components/CollectionHeader';
import EditCollectionModal from '../components/modals/EditCollectionModal';
import { collectionsService } from '../services/firebase';
import toast from 'react-hot-toast';

import APITester from '../components/APITester'; // ✅ Import temporaneo

function CollectionDetailPage() {
    const {
        collection,
        loading,
        error,
        hasAccess,
        isOwner,
        canEdit,
        userRole
    } = useCollection();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('cards');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ GESTIONE EDIT COLLEZIONE
    const handleEditCollection = async (collectionId, updateData) => {
        try {
            setIsLoading(true);
            await collectionsService.updateCollection(collectionId, updateData);
            setIsEditModalOpen(false);
            toast.success(`Collection "${updateData.name}" updated successfully! ✏️`);
        } catch (error) {
            console.error('❌ Error updating collection:', error);
            toast.error('Failed to update collection. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ GESTIONE CONDIVISIONE
    const handleShareCollection = () => {
        // TODO: Implementare modal condivisione
        toast.success('Share feature coming soon! 🔗');
    };

    // ✅ LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black 
                      pt-32 flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 
                          border-white mx-auto mb-4"></div>
                    <p className="text-white/70">Loading collection...</p>
                </div>
            </div>
        );
    }

    // ✅ ERROR STATE
    if (error || !hasAccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black 
                      pt-32 flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl p-8 text-center max-w-md">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-white text-xl font-semibold mb-2">
                        {error || 'Access Denied'}
                    </h2>
                    <p className="text-white/70 mb-6">
                        {error === 'Collection not found'
                            ? 'This collection doesn\'t exist or has been deleted.'
                            : 'You don\'t have permission to view this collection.'
                        }
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                       border border-purple-400/30 text-white rounded-lg py-3 px-6 
                       hover:from-purple-500/40 hover:to-pink-500/40 
                       hover:border-purple-400/50 transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // ✅ REDIRECT SE COLLEZIONE NON TROVATA
    if (!collection) {
        return <Navigate to="/collections" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-7xl mx-auto">

                {/* ✅ HEADER COLLEZIONE */}
                <CollectionHeader
                    collection={collection}
                    isOwner={isOwner}
                    canEdit={canEdit}
                    onEdit={() => setIsEditModalOpen(true)}
                    onShare={handleShareCollection}
                />

                {/* ✅ TABS NAVIGATION */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl mb-8">
                    <div className="flex border-b border-white/[0.08]">

                        <button
                            onClick={() => setActiveTab('cards')}
                            className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'cards'
                                ? 'text-white border-b-2 border-purple-400 bg-white/[0.05]'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            Cards (0)
                        </button>

                        <button
                            onClick={() => setActiveTab('sets')}
                            className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'sets'
                                ? 'text-white border-b-2 border-purple-400 bg-white/[0.05]'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            Sets (0)
                        </button>

                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'statistics'
                                ? 'text-white border-b-2 border-purple-400 bg-white/[0.05]'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            Statistics
                        </button>

                        {canEdit && (
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'settings'
                                    ? 'text-white border-b-2 border-purple-400 bg-white/[0.05]'
                                    : 'text-white/70 hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                Settings
                            </button>
                        )}
                    </div>

                    {/* ✅ TAB CONTENT */}
                    <div className="p-8">
                        {activeTab === 'cards' && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-white text-xl font-semibold mb-2">
                                    No cards yet
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Start adding cards to your collection to see them here.
                                </p>
                                <button className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                   border border-purple-400/30 text-white rounded-lg py-3 px-6 
                                   hover:from-purple-500/40 hover:to-pink-500/40 
                                   hover:border-purple-400/50 transition-all duration-200">
                                    Add Cards (Coming Soon)
                                </button>
                            </div>
                        )}

                        {activeTab === 'sets' && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-white text-xl font-semibold mb-2">
                                    No sets yet
                                </h3>
                                <p className="text-white/70">
                                    Sets will appear here once you add cards from different sets.
                                </p>
                            </div>
                        )}

                        {activeTab === 'statistics' && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-white text-xl font-semibold mb-2">
                                    No statistics yet
                                </h3>
                                <p className="text-white/70">
                                    Statistics will be generated once you have cards in your collection.
                                </p>
                            </div>
                        )}

                        {activeTab === 'settings' && canEdit && (
                            <div className="max-w-2xl">
                                <h3 className="text-white text-lg font-semibold mb-6">
                                    Collection Settings
                                </h3>

                                <div className="space-y-4">
                                    <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                                  rounded-xl p-4">
                                        <h4 className="text-white font-medium mb-2">General</h4>
                                        <p className="text-white/70 text-sm mb-4">
                                            Manage basic collection settings and information.
                                        </p>
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="text-purple-300 hover:text-purple-200 text-sm font-medium"
                                        >
                                            Edit Collection Info →
                                        </button>
                                    </div>

                                    <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                                  rounded-xl p-4">
                                        <h4 className="text-white font-medium mb-2">Sharing & Privacy</h4>
                                        <p className="text-white/70 text-sm mb-4">
                                            Control who can view and edit your collection.
                                        </p>
                                        <button
                                            onClick={handleShareCollection}
                                            className="text-green-300 hover:text-green-200 text-sm font-medium"
                                        >
                                            Manage Sharing →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ TEMPORARY API TESTER - RIMUOVERE IN PRODUZIONE */}
                {process.env.NODE_ENV === 'development' && (
                    <APITester />
                )}

                {/* ✅ MODAL EDIT COLLEZIONE */}
                <EditCollectionModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditCollection}
                    collection={collection}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default CollectionDetailPage;
