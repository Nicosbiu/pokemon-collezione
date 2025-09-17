// src/pages/CollectionDetailPage.jsx - INTEGRAZIONE CARDGRID
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import { useCollectionCards } from '../hooks/useCollectionCards';
import CollectionHeader from '../components/CollectionHeader';
import EditCollectionModal from '../components/modals/EditCollectionModal';
import { CardGrid } from '../components/cards';
import { collectionsService } from '../services/firebase';
import toast from 'react-hot-toast';

function CollectionDetailPage() {
    const {
        collection,
        loading: collectionLoading,
        error: collectionError,
        isOwner,
        canEdit
    } = useCollection();

    const {
        ownedCards,
        loading: cardsLoading,
        toggleCardOwnership,
        getOwnershipStats
    } = useCollectionCards(collection?.id);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('cards');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ HANDLE ERROR STATES
    if (collectionError?.code === 'permission-denied') {
        return <Navigate to="/collections" replace />;
    }

    if (collectionError?.code === 'not-found') {
        return <Navigate to="/collections" replace />;
    }

    if (collectionLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white/70">Loading collection...</div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return <Navigate to="/collections" replace />;
    }

    // ✅ HANDLE EDIT COLLECTION
    const handleEditCollection = async (updatedData) => {
        setIsLoading(true);
        try {
            await collectionsService.updateCollection(collection.id, updatedData);
            setIsEditModalOpen(false);
            toast.success('Collection updated successfully! ✨');
        } catch (error) {
            console.error('Error updating collection:', error);
            toast.error(`Failed to update collection: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLE SHARE COLLECTION
    const handleShareCollection = async () => {
        try {
            const shareUrl = `${window.location.origin}/collections/${collection.id}`;
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Collection link copied to clipboard! 📋');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    // ✅ HANDLE TOGGLE CARD OWNERSHIP
    const handleToggleCardOwnership = async (card, shouldOwn) => {
        if (!canEdit) {
            toast.error('You don\'t have permission to edit this collection');
            return;
        }

        await toggleCardOwnership(card, shouldOwn);
    };

    // ✅ TABS CONFIGURATION
    const tabs = [
        { id: 'cards', label: 'Cards', icon: '🎴' },
        { id: 'sets', label: 'Sets', icon: '📦' },
        { id: 'statistics', label: 'Statistics', icon: '📊' },
        { id: 'settings', label: 'Settings', icon: '⚙️', visible: isOwner }
    ].filter(tab => tab.visible !== false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-7xl mx-auto">

                {/* ✅ COLLECTION HEADER */}
                <CollectionHeader
                    collection={collection}
                    isOwner={isOwner}
                    canEdit={canEdit}
                    onEdit={() => setIsEditModalOpen(true)}
                    onShare={handleShareCollection}
                    ownedCards={ownedCards}
                    getOwnershipStats={getOwnershipStats}
                />

                {/* ✅ TABS NAVIGATION */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                        rounded-2xl mb-8 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-200
                            whitespace-nowrap border-b-2 ${activeTab === tab.id
                                        ? 'text-white border-purple-400 bg-white/[0.08]'
                                        : 'text-white/70 border-transparent hover:text-white hover:bg-white/[0.04]'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ✅ TAB CONTENT */}
                <div className="space-y-8">

                    {/* ✅ CARDS TAB */}
                    {activeTab === 'cards' && (
                        <CardGrid
                            collectionId={collection.id}
                            language={collection.language || 'en'}
                            ownedCards={ownedCards}
                            onToggleOwned={handleToggleCardOwnership}
                            className="fade-in"
                        />
                    )}

                    {/* ✅ SETS TAB */}
                    {activeTab === 'sets' && (
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                            rounded-2xl p-8 text-center">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-white text-xl font-semibold mb-2">
                                Sets View
                            </h3>
                            <p className="text-white/70 mb-6">
                                View and manage Pokemon sets in your collection
                            </p>
                            <div className="text-white/50 text-sm">
                                🚧 Coming soon in the next update
                            </div>
                        </div>
                    )}

                    {/* ✅ STATISTICS TAB */}
                    {activeTab === 'statistics' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Completion Stats */}
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                              rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-2xl">📈</div>
                                    <h3 className="text-white font-semibold">Completion</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Total Cards</span>
                                        <span className="text-white">{getOwnershipStats().total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Owned</span>
                                        <span className="text-green-300">{getOwnershipStats().owned}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Completion</span>
                                        <span className="text-purple-300">{getOwnershipStats().completion}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                              rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-2xl">⚡</div>
                                    <h3 className="text-white font-semibold">Activity</h3>
                                </div>

                                <div className="text-center py-4">
                                    <div className="text-white/50 text-sm">
                                        🚧 Activity tracking coming soon
                                    </div>
                                </div>
                            </div>

                            {/* Collection Info */}
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                              rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-2xl">ℹ️</div>
                                    <h3 className="text-white font-semibold">Info</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Created</span>
                                        <span className="text-white">
                                            {collection.createdAt?.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Language</span>
                                        <span className="text-white">{collection.language || 'en'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Visibility</span>
                                        <span className="text-white capitalize">{collection.visibility}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ SETTINGS TAB */}
                    {activeTab === 'settings' && isOwner && (
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                            rounded-2xl p-8">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⚙️</div>
                                <h3 className="text-white text-xl font-semibold mb-2">
                                    Collection Settings
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Manage your collection preferences and advanced options
                                </p>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white 
                             rounded-xl font-medium transition-colors duration-200"
                                >
                                    Edit Collection
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ✅ EDIT COLLECTION MODAL */}
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
