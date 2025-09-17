// src/components/EditCollectionModal.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { pokemonAPI } from '../../services/pokemonAPI';

function EditCollectionModal({ isOpen, onClose, onSubmit, collection, isLoading = false }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        gameId: 'pokemon',
        language: 'en'
    });

    const supportedLanguages = pokemonAPI.getSupportedLanguages();

    // Popola il form con i dati della collezione esistente
    useEffect(() => {
        if (collection && isOpen) {
            setFormData({
                name: collection.name || '',
                description: collection.description || '',
                gameId: collection.gameId || 'pokemon',
                language: collection.language || 'en' // ✅ Carica lingua esistente
            });
        }
    }, [collection, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(collection.id, formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-xl font-semibold">Edit Collection</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white/70 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Collection Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                         focus:outline-none focus:border-white/30 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="My Pokemon Collection"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                         focus:outline-none focus:border-white/30 transition-all resize-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Collection for my favorite cards..."
                            rows="3"
                        />
                    </div>

                    {/* ✅ LINGUA COLLEZIONE - STILE CORRETTO */}
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Collection Language
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white 
                         focus:outline-none focus:border-white/30 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         [&>option]:bg-gray-800 [&>option]:text-white"
                        >
                            {Object.entries(supportedLanguages).map(([code, info]) => (
                                <option key={code} value={code} className="bg-gray-800 text-white">
                                    {info.flag} {info.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Card Game
                        </label>
                        <select
                            value={formData.gameId}
                            onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                            disabled={isLoading}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white 
                         focus:outline-none focus:border-white/30 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         [&>option]:bg-gray-800 [&>option]:text-white"
                        >
                            <option value="pokemon" className="bg-gray-800 text-white">Pokémon TCG</option>
                            <option value="magic" disabled className="bg-gray-800 text-white/50">Magic: The Gathering (Coming Soon)</option>
                            <option value="yugioh" disabled className="bg-gray-800 text-white/50">Yu-Gi-Oh! (Coming Soon)</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] 
                         text-white/70 rounded-lg py-3 px-4 
                         hover:bg-white/10 hover:border-white/20 hover:text-white 
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.name.trim()}
                            className="flex-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 
                         border border-blue-400/30 text-white rounded-lg py-3 px-4 
                         hover:from-blue-500/40 hover:to-cyan-500/40 
                         hover:border-blue-400/50 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Collection'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCollectionModal;
