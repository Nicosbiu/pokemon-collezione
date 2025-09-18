// src/pages/CollectionsPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collectionsService } from '../services/firebase';
import CreateCollectionModal from '../components/modals/CreateCollectionModal';
import EditCollectionModal from '../components/modals/EditCollectionModal';
import DeleteCollectionModal from '../components/modals/DeleteCollectionModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ✅ COMPONENTE COLLEZIONE CARD CON ACTION BUTTONS
function CollectionCard({ collection, onEdit, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 
                 transition-all duration-300 cursor-pointer relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Content */}
            <h3 className="text-white text-lg font-semibold mb-2 pr-20">
                {collection.name}
            </h3>
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
                {collection.description || 'No description provided.'}
            </p>
            <div className="flex justify-between items-center text-white/50 text-sm">
                <span>0 cards</span>
                <span className="capitalize">{collection.gameId} TCG</span>
            </div>

            {/* ✅ Floating Action Buttons - Appaiono al hover */}
            <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>

                {/* Edit Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(collection);
                    }}
                    className="p-2 backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 
                     text-blue-300 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 
                     hover:text-blue-200 transition-all duration-200 
                     hover:shadow-lg hover:shadow-blue-500/25"
                    title="Edit Collection"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(collection);
                    }}
                    className="p-2 backdrop-blur-xl bg-red-500/20 border border-red-400/30 
                     text-red-300 rounded-lg hover:bg-red-500/30 hover:border-red-400/50 
                     hover:text-red-200 transition-all duration-200 
                     hover:shadow-lg hover:shadow-red-500/25"
                    title="Delete Collection"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ✅ COMPONENTE PRINCIPALE
function CollectionsPage() {
    const { currentUser, loading } = useAuth();
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Stati per i modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    // Carica collezioni all'avvio
    useEffect(() => {
        if (currentUser) {
            loadCollections();
        }
    }, [currentUser]);

    // ✅ CARICA COLLEZIONI
    const loadCollections = async () => {
        try {
            setIsLoading(true);
            const userCollections = await collectionsService.getUserCollections(currentUser.uid);
            setCollections(userCollections);
            console.log('📚 Loaded collections:', userCollections);
        } catch (error) {
            console.error('❌ Error loading collections:', error);
            toast.error('Failed to load collections');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ CREA COLLEZIONE
    const handleCreateCollection = async () => {
        // Non riceve più collectionData perché viene gestito dal modal interno
        // Ricarica semplicemente le collezioni dopo la creazione
        await loadCollections();
        setIsCreateModalOpen(false);
        // Il toast di successo viene già mostrato dal modal
    };

    // ✅ MODIFICA COLLEZIONE
    const handleEditCollection = async (collectionId, updateData) => {
        try {
            setIsLoading(true);
            await collectionsService.updateCollection(collectionId, updateData);
            await loadCollections();
            setIsEditModalOpen(false);
            setSelectedCollection(null);
            toast.success(`Collection "${updateData.name}" updated successfully! ✏️`);
        } catch (error) {
            console.error('❌ Error updating collection:', error);
            toast.error('Failed to update collection. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ ELIMINA COLLEZIONE
    const handleDeleteCollection = async (collectionId) => {
        try {
            setIsLoading(true);
            await collectionsService.deleteCollection(collectionId);
            await loadCollections();
            setIsDeleteModalOpen(false);
            setSelectedCollection(null);
            toast.success('Collection deleted successfully! 🗑️');
        } catch (error) {
            console.error('❌ Error deleting collection:', error);
            toast.error('Failed to delete collection. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLER PER APRIRE MODAL DI MODIFICA
    const openEditModal = (collection) => {
        setSelectedCollection(collection);
        setIsEditModalOpen(true);
    };

    // ✅ HANDLER PER APRIRE MODAL DI ELIMINAZIONE
    const openDeleteModal = (collection) => {
        setSelectedCollection(collection);
        setIsDeleteModalOpen(true);
    };

    // Loading iniziale
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
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black 
                    pt-32 p-8">

            {/* ✅ HEADER */}
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-white text-3xl font-bold mb-2">
                            Your Collections ⚡
                        </h1>
                        <p className="text-white/70">
                            Welcome back, {currentUser?.email}! You have {collections.length} collection(s).
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                       border border-purple-400/30 text-white rounded-lg py-3 px-6 
                       hover:from-purple-500/40 hover:to-pink-500/40 
                       hover:border-purple-400/50 transition-all duration-200
                       flex items-center justify-center gap-2 sm:w-auto
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="w-5 h-5" />
                        {isLoading ? 'Creating...' : 'New Collection'}
                    </button>
                </div>
            </div>

            {/* ✅ COLLECTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading skeleton
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                    rounded-2xl p-6 animate-pulse">
                            <div className="h-6 bg-white/10 rounded mb-2"></div>
                            <div className="h-4 bg-white/10 rounded mb-4"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-white/10 rounded w-16"></div>
                                <div className="h-4 bg-white/10 rounded w-20"></div>
                            </div>
                        </div>
                    ))
                ) : collections.length > 0 ? (
                    // ✅ Mostra collezioni reali con nuove card
                    collections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                        />
                    ))
                ) : (
                    // ✅ Stato vuoto
                    <div className="col-span-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                          rounded-2xl p-8 text-center">
                        <p className="text-white/70 text-lg mb-4">
                            📚 No collections yet
                        </p>
                        <p className="text-white/50 text-sm mb-6">
                            Create your first collection to start organizing your cards!
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                         border border-purple-400/30 text-white rounded-lg py-3 px-6 
                         hover:from-purple-500/40 hover:to-pink-500/40 
                         hover:border-purple-400/50 transition-all duration-200
                         inline-flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create First Collection
                        </button>
                    </div>
                )}
            </div>

            {/* ✅ MODAL CREATION */}
            <CreateCollectionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateCollection}  // Solo callback per reload
                isLoading={isLoading}
            />

            {/* ✅ MODAL EDIT */}
            <EditCollectionModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCollection(null);
                }}
                onSubmit={handleEditCollection}
                collection={selectedCollection}
                isLoading={isLoading}
            />

            {/* ✅ MODAL DELETE */}
            <DeleteCollectionModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCollection(null);
                }}
                onConfirm={handleDeleteCollection}
                collection={selectedCollection}
                isLoading={isLoading}
            />
        </div>
    );
}

export default CollectionsPage;
