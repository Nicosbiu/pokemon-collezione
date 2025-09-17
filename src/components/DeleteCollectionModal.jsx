// src/components/DeleteCollectionModal.jsx
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function DeleteCollectionModal({ isOpen, onClose, onConfirm, collection, isLoading = false }) {
    if (!isOpen || !collection) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className="text-white text-xl font-semibold">Delete Collection</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white/70 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-white/90 mb-2">
                        Are you sure you want to delete this collection?
                    </p>
                    <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 
                          rounded-lg p-4 mb-4">
                        <p className="text-red-300 font-semibold">"{collection.name}"</p>
                        <p className="text-red-200/70 text-sm mt-1">
                            This action cannot be undone. All cards in this collection will be lost.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
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
                        onClick={() => onConfirm(collection.id)}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-red-500/30 to-rose-500/30 
                       border border-red-400/30 text-white rounded-lg py-3 px-4 
                       hover:from-red-500/40 hover:to-rose-500/40 
                       hover:border-red-400/50 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Deleting...
                            </>
                        ) : (
                            'Delete Collection'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteCollectionModal;
