// src/components/CreateCollectionModal.jsx
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function CreateCollectionModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        gameId: 'pokemon'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({ name: '', description: '', gameId: 'pokemon' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-xl font-semibold">Create New Collection</h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Collection Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                         focus:outline-none focus:border-white/30 transition-all"
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
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white placeholder-white/50 
                         focus:outline-none focus:border-white/30 transition-all resize-none"
                            placeholder="Collection for my favorite cards..."
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Card Game
                        </label>
                        <select
                            value={formData.gameId}
                            onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                            className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                         rounded-lg px-4 py-3 text-white 
                         focus:outline-none focus:border-white/30 transition-all"
                        >
                            <option value="pokemon">Pokémon TCG</option>
                            <option value="magic" disabled>Magic: The Gathering (Coming Soon)</option>
                            <option value="yugioh" disabled>Yu-Gi-Oh! (Coming Soon)</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] 
                         text-white/70 rounded-lg py-3 px-4 
                         hover:bg-white/10 hover:border-white/20 hover:text-white 
                         transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                         border border-purple-400/30 text-white rounded-lg py-3 px-4 
                         hover:from-purple-500/40 hover:to-pink-500/40 
                         hover:border-purple-400/50 transition-all duration-200"
                        >
                            Create Collection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCollectionModal;
