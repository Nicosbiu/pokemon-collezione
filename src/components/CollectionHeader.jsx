// src/components/CollectionHeader.jsx - Header della collezione con breadcrumb
import { Link } from 'react-router-dom';
import {
    ChevronRightIcon,
    UsersIcon,
    CalendarIcon,
    LanguageIcon,
    PencilIcon,
    ShareIcon
} from '@heroicons/react/24/outline';

function CollectionHeader({ collection, isOwner, canEdit, onEdit, onShare }) {
    if (!collection) return null;

    // Flag della lingua
    const languageFlags = {
        'en': '🇺🇸',
        'it': '🇮🇹',
        'ja': '🇯🇵',
        'fr': '🇫🇷',
        'es': '🇪🇸',
        'de': '🇩🇪'
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const memberCount = Object.keys(collection.members || {}).length;

    return (
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                    rounded-2xl p-8 mb-8">

            {/* ✅ BREADCRUMB */}
            <nav className="flex items-center space-x-2 text-sm mb-6">
                <Link
                    to="/collections"
                    className="text-white/70 hover:text-white transition-colors"
                >
                    Collections
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-white/50" />
                <span className="text-white font-medium">{collection.name}</span>
            </nav>

            {/* ✅ HEADER PRINCIPALE */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                {/* Info Collezione */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {collection.name}
                        </h1>

                        {/* Actions per Owner/Editor */}
                        {canEdit && (
                            <div className="flex gap-2">
                                <button
                                    onClick={onEdit}
                                    className="p-2 backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 
                           text-blue-300 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 
                           hover:text-blue-200 transition-all duration-200"
                                    title="Edit Collection"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={onShare}
                                    className="p-2 backdrop-blur-xl bg-green-500/20 border border-green-400/30 
                           text-green-300 rounded-lg hover:bg-green-500/30 hover:border-green-400/50 
                           hover:text-green-200 transition-all duration-200"
                                    title="Share Collection"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {collection.description && (
                        <p className="text-white/70 text-lg mb-4 leading-relaxed">
                            {collection.description}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">

                        {/* Lingua */}
                        <div className="flex items-center gap-2">
                            <LanguageIcon className="w-4 h-4 text-white/70" />
                            <span className="text-white/70">
                                {languageFlags[collection.language]} {collection.language?.toUpperCase()}
                            </span>
                        </div>

                        {/* Membri */}
                        <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-white/70" />
                            <span className="text-white/70">
                                {memberCount} {memberCount === 1 ? 'membro' : 'membri'}
                            </span>
                        </div>

                        {/* Data creazione */}
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-white/70" />
                            <span className="text-white/70">
                                Creata il {formatDate(collection.createdAt)}
                            </span>
                        </div>

                        {/* Game Type */}
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500/50 to-pink-500/50"></div>
                            <span className="text-white/70 capitalize">
                                {collection.gameId} TCG
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Box */}
                <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] 
                        rounded-xl p-6 min-w-[280px]">
                    <h3 className="text-white font-semibold mb-4">Collection Stats</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">0</div>
                            <div className="text-white/70 text-sm">Total Cards</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">0</div>
                            <div className="text-white/70 text-sm">Owned</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">0%</div>
                            <div className="text-white/70 text-sm">Complete</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">0</div>
                            <div className="text-white/70 text-sm">Sets</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-white/70 mb-2">
                            <span>Progress</span>
                            <span>0%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: '0%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionHeader;
