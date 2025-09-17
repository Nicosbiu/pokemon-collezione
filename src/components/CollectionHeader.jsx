// src/components/CollectionHeader.jsx - AGGIORNATO CON STATS CARTE
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PencilIcon,
    ShareIcon,
    EllipsisVerticalIcon,
    HeartIcon,
    StarIcon
} from '@heroicons/react/24/outline';

function CollectionHeader({
    collection,
    isOwner,
    canEdit,
    onEdit,
    onShare,
    ownedCards = new Set(),
    getOwnershipStats = () => ({ owned: 0, total: 0, completion: 0 })
}) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    if (!collection) return null;

    // ✅ GET OWNERSHIP STATS
    const stats = getOwnershipStats();

    // ✅ PERMISSION LABELS
    const getPermissionLabel = () => {
        if (isOwner) return 'Owner';
        if (canEdit) return 'Editor';
        return 'Viewer';
    };

    const getPermissionColor = () => {
        if (isOwner) return 'text-purple-300';
        if (canEdit) return 'text-blue-300';
        return 'text-green-300';
    };

    return (
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                    rounded-2xl p-8 mb-8">

            {/* ✅ BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
                <button
                    onClick={() => navigate('/collections')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Collections</span>
                </button>
                <span>/</span>
                <span className="text-white">{collection.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                {/* ✅ COLLECTION INFO */}
                <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">

                        {/* Collection Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 
                            rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl text-white">
                                {collection.game === 'pokemon' ? '🎴' : '🎮'}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-white text-3xl font-bold mb-2 break-words">
                                {collection.name}
                            </h1>

                            {collection.description && (
                                <p className="text-white/70 text-lg mb-3 line-clamp-2">
                                    {collection.description}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                                <span>By {collection.ownerName}</span>
                                <span>•</span>
                                <span>{collection.visibility}</span>
                                <span>•</span>
                                <span className={getPermissionColor()}>
                                    {getPermissionLabel()}
                                </span>
                                <span>•</span>
                                <span>
                                    {collection.createdAt?.toDate().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ✅ COLLECTION STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                        {/* Total Cards */}
                        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                            rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {stats.total || 0}
                            </div>
                            <div className="text-white/70 text-sm">Total Cards</div>
                        </div>

                        {/* Owned Cards */}
                        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                            rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-300 mb-1">
                                {stats.owned || 0}
                            </div>
                            <div className="text-white/70 text-sm">Owned</div>
                        </div>

                        {/* Needed Cards */}
                        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                            rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-orange-300 mb-1">
                                {stats.needed || 0}
                            </div>
                            <div className="text-white/70 text-sm">Needed</div>
                        </div>

                        {/* Completion */}
                        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                            rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-300 mb-1">
                                {stats.completion || 0}%
                            </div>
                            <div className="text-white/70 text-sm">Complete</div>
                        </div>
                    </div>

                    {/* ✅ PROGRESS BAR */}
                    {stats.total > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-white/70 mb-2">
                                <span>Collection Progress</span>
                                <span>{stats.completion}% Complete</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${stats.completion}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ✅ ACTION BUTTONS */}
                <div className="flex items-center gap-3">

                    {/* Share Button */}
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 
                       border border-blue-500/30 text-blue-300 rounded-xl font-medium 
                       transition-all duration-200"
                    >
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                    </button>

                    {/* Edit Button (solo per owner/editor) */}
                    {canEdit && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 
                         border border-purple-500/30 text-purple-300 rounded-xl font-medium 
                         transition-all duration-200"
                        >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    )}

                    {/* Menu Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] 
                         text-white rounded-xl transition-all duration-200"
                        >
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 z-20
                              backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                              rounded-xl shadow-2xl overflow-hidden">
                                <button className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/[0.08] 
                                   hover:text-white transition-colors text-sm">
                                    Export Collection
                                </button>
                                <button className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/[0.08] 
                                   hover:text-white transition-colors text-sm">
                                    Collection Stats
                                </button>
                                {isOwner && (
                                    <button className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 
                                     transition-colors text-sm border-t border-white/[0.08]">
                                        Delete Collection
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Close menu on outside click */}
                        {showMenu && (
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            ></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionHeader;
