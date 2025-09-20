// src/pages/CollectionsPage.jsx - VERSIONE COMPLETA FUNZIONANTE
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collectionsService } from '../services/firebase';
import CreateCollectionModal from '../components/modals/CreateCollectionModal';
import EditCollectionModal from '../components/modals/EditCollectionModal';
import DeleteCollectionModal from '../components/modals/DeleteCollectionModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ✅ COLLEZIONE CARD - Badge allineato correttamente
function CollectionCard({ collection, onEdit, onDelete, onView }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                 rounded-2xl hover:bg-white/10 hover:border-white/20 
                 transition-all duration-300 cursor-pointer relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onView(collection)}
        >
            {/* ✅ BADGE SET - Padding ridotto per allineamento */}
            <div className="pt-4 pl-4 pr-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border
                               ${collection.type === 'base'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                    }`}>
                    {collection.type === 'base' ? collection.setName || 'Base Set' : 'Personalizzata'}
                </span>
            </div>

            {/* ✅ RESTO DEL CONTENUTO - Padding normale */}
            <div className="px-6 pb-6">
                {/* TITOLO SOTTO IL BADGE */}
                <h3 className="text-white text-lg font-semibold mb-2 mt-3">
                    {collection.name}
                </h3>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {collection.description || 'Nessuna descrizione fornita.'}
                </p>

                <div className="flex justify-between items-center text-white/50 text-sm mb-3">
                    <span>
                        {collection.ownedCards || 0}/{collection.totalCards || 0} carte
                    </span>
                    <span className="capitalize">{collection.gameId} TCG</span>
                </div>

                {/* Progress bar */}
                {collection.totalCards > 0 && (
                    <div className="w-full bg-white/10 rounded-full h-1">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.round(((collection.ownedCards || 0) / collection.totalCards) * 100)}%`
                            }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(collection);
                    }}
                    className="p-2 backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 
                     text-blue-300 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 
                     hover:text-blue-200 transition-all duration-200"
                    title="Modifica Collezione"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(collection);
                    }}
                    className="p-2 backdrop-blur-xl bg-red-500/20 border border-red-400/30 
                     text-red-300 rounded-lg hover:bg-red-500/30 hover:border-red-400/50 
                     hover:text-red-200 transition-all duration-200"
                    title="Elimina Collezione"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ✅ MAIN COMPONENT - Allineamento perfetto con Dashboard
function CollectionsPage() {
    const navigate = useNavigate();
    const { currentUser, loading } = useAuth();
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Stati modali
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    // ✅ CARICA COLLEZIONI
    useEffect(() => {
        if (currentUser) {
            loadCollections();
        }
    }, [currentUser]);

    const loadCollections = async () => {
        try {
            setIsLoading(true);
            const userCollections = await collectionsService.getUserCollections(currentUser.uid);
            setCollections(userCollections);
            console.log('📚 Loaded collections:', userCollections);
        } catch (error) {
            console.error('❌ Error loading collections:', error);
            toast.error('Errore nel caricamento delle collezioni');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ NAVIGAZIONE AL BINDER
    const handleViewCollection = (collection) => {
        navigate(`/collection/${collection.id}`);
    };

    // ✅ CREA COLLEZIONE
    const handleCreateCollection = async () => {
        await loadCollections();
        setIsCreateModalOpen(false);
    };

    // ✅ MODIFICA COLLEZIONE
    const handleEditCollection = async (collectionId, updateData) => {
        try {
            setIsLoading(true);
            await collectionsService.updateCollection(collectionId, updateData);
            await loadCollections();
            setIsEditModalOpen(false);
            setSelectedCollection(null);
            toast.success(`Collezione "${updateData.name}" aggiornata con successo! ✏️`);
        } catch (error) {
            console.error('❌ Error updating collection:', error);
            toast.error('Errore nell\'aggiornamento della collezione');
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
            toast.success('Collezione eliminata con successo! 🗑️');
        } catch (error) {
            console.error('❌ Error deleting collection:', error);
            toast.error('Errore nell\'eliminazione della collezione');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (collection) => {
        setSelectedCollection(collection);
        setIsEditModalOpen(true);
    };

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
                    <p className="text-white/70 mt-4 text-center">Caricamento...</p>
                </div>
            </div>
        );
    }

    return (
        // ✅ ALLINEAMENTO IDENTICO ALLA DASHBOARD
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-7xl mx-auto">

                {/* ✅ HEADER */}
                <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                          rounded-2xl p-8 mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-white text-3xl font-bold mb-2">
                                Le Tue Collezioni
                            </h1>
                            <p className="text-white/70">
                                Bentornato, {currentUser?.displayName}! Hai {collections.length} {(collections.length == 1) ? "collezione" : "collezioni"}.
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
                            {isLoading ? 'Creazione...' : 'Nuova Collezione'}
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
                        // ✅ Collezioni reali
                        collections.map((collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                                onView={handleViewCollection}
                            />
                        ))
                    ) : (
                        // ✅ Stato vuoto
                        <div className="col-span-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                              rounded-2xl p-8 text-center">
                            <p className="text-white/70 text-lg mb-4">
                                📚 Nessuna collezione ancora
                            </p>
                            <p className="text-white/50 text-sm mb-6">
                                Crea la tua prima collezione per iniziare a organizzare le tue carte!
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
                                Crea Prima Collezione
                            </button>
                        </div>
                    )}
                </div>

                {/* ✅ MODAL COMPONENTS */}
                <CreateCollectionModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateCollection}
                    isLoading={isLoading}
                />

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
        </div>
    );
}

export default CollectionsPage;
