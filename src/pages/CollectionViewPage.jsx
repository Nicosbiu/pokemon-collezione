// src/pages/CollectionViewPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collectionsService } from '../services/firebase';
import { PokemonAPI } from '../services/pokemonAPI'; // ✅ AGGIUNGI per immagini API
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// ✅ POKEMON CARD COMPONENT - Con immagini dall'API
function PokemonCard({ card, isOwned, onToggleOwn }) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // ✅ SEMPLIFICATO: usa direttamente le immagini dalla cache database
    const imageUrl = card.images?.small || card.images?.large || null;

    return (
        <div className="group relative backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                       rounded-xl p-3 hover:bg-white/10 hover:border-white/20 
                       transition-all duration-300 cursor-pointer">

            <div className="relative mb-3 aspect-[2.5/3.5]">

                {imageLoading && !imageError && imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg 
                                   animate-pulse flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/40"></div>
                    </div>
                )}

                {/* ✅ IMMAGINE DIRETTA dal database */}
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={card.name}
                        className={`w-full h-full object-cover rounded-lg shadow-lg transition-all duration-300
                                  ${imageLoading ? 'opacity-0' : 'opacity-100'}
                                  ${!isOwned ? 'grayscale-[60%] opacity-50' : ''}
                                  hover:scale-105 hover:shadow-2xl`}
                        loading="lazy"
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                        }}
                    />
                ) : (
                    // Fallback
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 
                                   rounded-lg flex flex-col items-center justify-center text-white/60 
                                   border border-white/5">
                        <div className="text-4xl mb-2">🃏</div>
                        <div className="text-xs text-center px-2 font-medium">{card.name}</div>
                        <div className="text-xs text-white/40 mt-1">#{card.number}</div>
                    </div>
                )}

                {/* Toggle button e resto uguale... */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleOwn(card.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm 
                              border-2 transition-all duration-200 
                              ${isOwned
                            ? 'bg-green-500/90 border-green-400/70 text-white shadow-lg shadow-green-500/25 scale-100'
                            : 'bg-black/70 border-white/30 text-white/70 hover:text-white hover:bg-black/90 scale-90 group-hover:scale-100'
                        }`}
                >
                    {isOwned ?
                        <HeartSolidIcon className="w-4 h-4" /> :
                        <HeartIcon className="w-4 h-4" />
                    }
                </button>

                {!isOwned && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-white/90 text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                            Non Posseduta
                        </div>
                    </div>
                )}
            </div>

            {/* Info carta */}
            <div className="text-center space-y-2">
                <h3 className="text-white text-sm font-medium truncate leading-tight">
                    {card.name}
                </h3>
                <div className="flex justify-between items-center text-xs text-white/60">
                    <span className="font-mono">#{card.number}</span>
                    {card.rarity && (
                        <span className="capitalize truncate ml-2">{card.rarity}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ✅ MAIN COMPONENT - Resto uguale, solo cambiata la griglia
function CollectionViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Stati - uguali a prima
    const [collection, setCollection] = useState(null);
    const [cards, setCards] = useState([]);
    const [ownedCards, setOwnedCards] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOnlyOwned, setShowOnlyOwned] = useState(false);

    // Funzioni - uguali a prima
    useEffect(() => {
        if (id && currentUser) {
            loadCollectionData();
        }
    }, [id, currentUser]);

    const loadCollectionData = async () => {
        setLoading(true);
        setError(null);

        try {
            const collectionData = await collectionsService.getCollectionById(id);
            if (!collectionData) {
                setError('Collezione non trovata');
                return;
            }

            if (collectionData.ownerId !== currentUser.uid &&
                !collectionData.members?.[currentUser.uid]) {
                setError('Non hai i permessi per visualizzare questa collezione');
                return;
            }

            setCollection(collectionData);

            const collectionCards = await collectionsService.getCollectionCards(id);
            setCards(collectionCards);

            const userOwnership = await collectionsService.getUserOwnership(currentUser.uid, id);
            setOwnedCards(new Set(userOwnership));

        } catch (error) {
            console.error('❌ Error loading collection:', error);
            setError('Errore nel caricamento della collezione');
            toast.error('Errore nel caricamento della collezione');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCardOwnership = async (cardId) => {
        try {
            const wasOwned = ownedCards.has(cardId);

            const newOwnedCards = new Set(ownedCards);
            if (wasOwned) {
                newOwnedCards.delete(cardId);
            } else {
                newOwnedCards.add(cardId);
            }
            setOwnedCards(newOwnedCards);

            await collectionsService.updateCardOwnership(
                currentUser.uid,
                id,
                cardId,
                !wasOwned
            );

            const card = cards.find(c => c.id === cardId);
            toast.success(
                wasOwned
                    ? `${card?.name} rimossa dalla collezione`
                    : `${card?.name} aggiunta alla collezione! 🎉`
            );

        } catch (error) {
            console.error('❌ Error toggling card ownership:', error);
            toast.error('Errore nell\'aggiornamento della carta');
            loadCollectionData();
        }
    };

    const filteredCards = showOnlyOwned
        ? cards.filter(card => ownedCards.has(card.id))
        : cards;

    const ownedCount = ownedCards.size;
    const totalCount = cards.length;
    const completionPercentage = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

    // Loading e Error states - uguali a prima
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                        <div className="text-white/60">Caricamento collezione...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 px-4">
                <div className="max-w-7xl mx-auto text-center py-16">
                    <div className="text-red-400 text-lg mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/collections')}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                 border border-purple-400/30 text-white rounded-lg py-2 px-4 
                                 hover:from-purple-500/40 hover:to-pink-500/40 
                                 transition-all duration-200"
                    >
                        Torna alle Collezioni
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header e Stats - uguali a prima */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/collections')}
                            className="p-2 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-lg hover:bg-white/10 hover:border-white/20 
                                     transition-all duration-200 text-white/70 hover:text-white"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {collection?.name}
                            </h1>
                            <p className="text-white/60 text-sm">
                                {collection?.setName || 'Collezione Personalizzata'}
                            </p>
                        </div>
                    </div>

                    {/* Stats cards e progress bar - uguali a prima */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                       rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{ownedCount}</div>
                            <div className="text-white/60 text-sm">Carte Possedute</div>
                        </div>

                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                       rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{totalCount}</div>
                            <div className="text-white/60 text-sm">Carte Totali</div>
                        </div>

                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                       rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">{completionPercentage}%</div>
                            <div className="text-white/60 text-sm">Completamento</div>
                        </div>

                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                       rounded-xl p-4 text-center">
                            <button
                                onClick={() => setShowOnlyOwned(!showOnlyOwned)}
                                className="flex items-center justify-center gap-2 w-full text-white hover:text-purple-300 transition-colors"
                            >
                                {showOnlyOwned ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                <span className="text-sm">
                                    {showOnlyOwned ? 'Mostra Tutte' : 'Solo Possedute'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                   rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/80 text-sm">Progresso Collezione</span>
                            <span className="text-white text-sm font-medium">{ownedCount}/{totalCount}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* ✅ GRIGLIA CARTE - 6 per riga invece di 8 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-8">
                    {filteredCards.map((card) => (
                        <PokemonCard
                            key={card.id}
                            card={card}
                            isOwned={ownedCards.has(card.id)}
                            onToggleOwn={handleToggleCardOwnership}
                        />
                    ))}
                </div>

                {/* Empty state - uguale a prima */}
                {filteredCards.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-white/40 text-lg mb-2">
                            {showOnlyOwned ? 'Nessuna carta posseduta' : 'Nessuna carta trovata'}
                        </div>
                        <div className="text-white/60 text-sm">
                            {showOnlyOwned
                                ? 'Inizia ad aggiungere carte alla tua collezione!'
                                : 'Questa collezione sembra vuota.'
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CollectionViewPage;
