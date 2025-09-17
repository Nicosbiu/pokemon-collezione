// src/components/CollectionCard.jsx
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
            <h3 className="text-white text-lg font-semibold mb-2 pr-8">
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

export default CollectionCard;
