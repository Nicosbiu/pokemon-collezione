// src/pages/CardDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collectionsService } from '../services/firebase';
import { PokemonAPI } from '../services/pokemonAPI';
import {
    ArrowLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ShareIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

function CardDetailPage() {
    const { collectionId, cardId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Stati
    const [card, setCard] = useState(null);
    const [collection, setCollection] = useState(null);
    const [allCards, setAllCards] = useState([]);
    const [isOwned, setIsOwned] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [showFullImage, setShowFullImage] = useState(false);

    useEffect(() => {
        if (collectionId && cardId && currentUser) {
            loadCardData();
        }
    }, [collectionId, cardId, currentUser]);

    const loadCardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Carica collezione
            const collectionData = await collectionsService.getCollectionById(collectionId);
            if (!collectionData) {
                setError('Collezione non trovata');
                return;
            }
            setCollection(collectionData);

            // Carica tutte le carte per navigazione
            const cards = await collectionsService.getCollectionCards(collectionId);
            setAllCards(cards);

            // Trova la carta specifica
            const currentCard = cards.find(c => c.id === cardId);
            if (!currentCard) {
                setError('Carta non trovata');
                return;
            }
            setCard(currentCard);

            // Controlla ownership
            const userOwnership = await collectionsService.getUserOwnership(currentUser.uid, collectionId);
            setIsOwned(userOwnership.includes(cardId));

        } catch (error) {
            console.error('❌ Error loading card data:', error);
            setError('Errore nel caricamento dei dati');
            toast.error('Errore nel caricamento');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleOwnership = async () => {
        try {
            await collectionsService.updateCardOwnership(
                currentUser.uid,
                collectionId,
                cardId,
                !isOwned
            );

            setIsOwned(!isOwned);
            toast.success(
                isOwned
                    ? `${card?.name} rimossa dalla collezione`
                    : `${card?.name} aggiunta alla collezione! 🎉`
            );
        } catch (error) {
            console.error('❌ Error toggling ownership:', error);
            toast.error('Errore nell\'aggiornamento');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${card?.name} - ${collection?.name}`,
                    text: `Guarda questa carta nella mia collezione Pokemon!`,
                    url: url,
                });
            } catch (error) {
                // Fallback to clipboard
                navigator.clipboard.writeText(url);
                toast.success('Link copiato negli appunti!');
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copiato negli appunti!');
        }
    };

    const navigateToCard = (direction) => {
        const currentIndex = allCards.findIndex(c => c.id === cardId);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : allCards.length - 1;
        } else {
            newIndex = currentIndex < allCards.length - 1 ? currentIndex + 1 : 0;
        }

        const newCard = allCards[newIndex];
        if (newCard) {
            navigate(`/collection/${collectionId}/card/${newCard.id}`);
        }
    };

    // ✅ HELPER: Ottieni colore per tipo Pokemon
    const getTypeColor = (type) => {
        const typeColors = {
            grass: 'bg-green-500/20 text-green-300 border-green-400/30',
            fire: 'bg-red-500/20 text-red-300 border-red-400/30',
            water: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
            lightning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
            psychic: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
            fighting: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
            darkness: 'bg-gray-800/20 text-gray-300 border-gray-400/30',
            metal: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
            fairy: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
            dragon: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
            colorless: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
        };
        return typeColors[type?.toLowerCase()] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    };

    // ✅ HELPER: Ottieni colore per rarità
    const getRarityColor = (rarity) => {
        if (!rarity) return 'bg-gray-500/20 text-gray-300 border-gray-400/30';

        const rarityLower = rarity.toLowerCase();
        if (rarityLower.includes('common')) return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
        if (rarityLower.includes('uncommon')) return 'bg-green-500/20 text-green-300 border-green-400/30';
        if (rarityLower.includes('rare holo') || rarityLower.includes('ultra rare')) return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
        if (rarityLower.includes('rare')) return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
        if (rarityLower.includes('secret') || rarityLower.includes('rainbow')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
        return 'bg-pink-500/20 text-pink-300 border-pink-400/30';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                        <div className="text-white/60">Caricamento carta...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
                <div className="max-w-7xl mx-auto text-center py-16">
                    <div className="text-red-400 text-lg mb-4">{error}</div>
                    <button
                        onClick={() => navigate(`/collection/${collectionId}`)}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                                 border border-purple-400/30 text-white rounded-lg py-2 px-4 
                                 hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200"
                    >
                        Torna al Binder
                    </button>
                </div>
            </div>
        );
    }

    const imageUrl = card?.images?.large || card?.images?.small || null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black pt-32 p-8">
            <div className="max-w-7xl mx-auto">

                {/* ✅ HEADER CON NAVIGAZIONE */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/collection/${collectionId}`)}
                            className="p-2 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-lg hover:bg-white/10 hover:border-white/20 
                                     transition-all duration-200 text-white/70 hover:text-white"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {card?.name}
                            </h1>
                            <p className="text-white/60 text-sm mt-2">
                                {collection?.name} • #{card?.number}
                            </p>
                        </div>
                    </div>

                    {/* ✅ AZIONI PRINCIPALI */}
                    <div className="flex items-center gap-3">
                        {/* Navigazione carte */}
                        <div className="flex bg-white/[0.08] border border-white/[0.12] rounded-lg">
                            <button
                                onClick={() => navigateToCard('prev')}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 
                                         transition-all duration-200 rounded-l-lg"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigateToCard('next')}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 
                                         transition-all duration-200 rounded-r-lg"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Condividi */}
                        <button
                            onClick={handleShare}
                            className="p-2 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                     rounded-lg hover:bg-white/10 hover:border-white/20 
                                     transition-all duration-200 text-white/70 hover:text-white"
                        >
                            <ShareIcon className="w-4 h-4" />
                        </button>

                        {/* Toggle Ownership */}
                        <button
                            onClick={handleToggleOwnership}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 
                                      ${isOwned
                                    ? 'bg-green-500/90 border-green-400/70 text-white shadow-lg shadow-green-500/25'
                                    : 'bg-black/70 border-white/30 text-white/70 hover:text-white hover:bg-black/90'
                                }`}
                        >
                            {isOwned ?
                                <HeartSolidIcon className="w-5 h-5" /> :
                                <HeartIcon className="w-5 h-5" />
                            }
                        </button>
                    </div>
                </div>

                {/* ✅ LAYOUT PRINCIPALE - Immagine SX + Dettagli DX */}
                <div className="grid lg:grid-cols-5 gap-8">

                    {/* ✅ IMMAGINE CARTA (2/5 dello spazio) */}
                    <div className="lg:col-span-2">
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                                      rounded-2xl p-6 sticky top-32">

                            {/* Immagine principale */}
                            <div className="relative mb-4 aspect-[2.5/3.5]">
                                {imageLoading && imageUrl && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 
                                                   rounded-xl animate-pulse flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40"></div>
                                    </div>
                                )}

                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={card?.name}
                                        className={`w-full h-full object-cover rounded-xl shadow-2xl 
                                                  transition-all duration-300 cursor-pointer hover:scale-[1.02]
                                                  ${imageLoading ? 'opacity-0' : 'opacity-100'}
                                                  ${!isOwned ? 'grayscale-[60%] opacity-70' : ''}`}
                                        onLoad={() => setImageLoading(false)}
                                        onClick={() => setShowFullImage(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 
                                                   rounded-xl flex flex-col items-center justify-center text-white/60 
                                                   border border-white/5">
                                        <div className="text-6xl mb-4">🃏</div>
                                        <div className="text-lg text-center font-medium">{card?.name}</div>
                                        <div className="text-white/40 mt-2">#{card?.number}</div>
                                    </div>
                                )}

                                {/* Badge ownership */}
                                {!isOwned && (
                                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                                        <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                            Non Posseduta
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info rapida sotto immagine */}
                            <div className="text-center">
                                <div className="flex justify-center items-center gap-2 mb-2">
                                    {card?.rarity && (
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border
                                                       ${getRarityColor(card.rarity)}`}>
                                            {card.rarity}
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/60 text-sm">
                                    Clicca l'immagine per ingrandire
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ DETTAGLI CARTA (3/5 dello spazio) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Info base */}
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Informazioni Base</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-sm">Nome</label>
                                    <p className="text-white font-medium">{card?.name}</p>
                                </div>

                                <div>
                                    <label className="text-white/60 text-sm">Numero Set</label>
                                    <p className="text-white font-medium">#{card?.number}</p>
                                </div>

                                {card?.hp && (
                                    <div>
                                        <label className="text-white/60 text-sm">HP</label>
                                        <p className="text-white font-medium text-lg">{card.hp}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-white/60 text-sm">Set</label>
                                    <p className="text-white font-medium">{card?.set?.name || collection?.setName}</p>
                                </div>
                            </div>

                            {/* Tipi */}
                            {card?.types && card.types.length > 0 && (
                                <div className="mt-4">
                                    <label className="text-white/60 text-sm mb-2 block">Tipi</label>
                                    <div className="flex flex-wrap gap-2">
                                        {card.types.map((type, index) => (
                                            <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium border
                                                                       ${getTypeColor(type)}`}>
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Attacchi */}
                        {card?.attacks && card.attacks.length > 0 && (
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Attacchi</h2>

                                <div className="space-y-4">
                                    {card.attacks.map((attack, index) => (
                                        <div key={index} className="border border-white/10 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-white font-medium">{attack.name}</h3>
                                                {attack.damage && (
                                                    <span className="text-red-400 font-bold">{attack.damage}</span>
                                                )}
                                            </div>

                                            {attack.cost && attack.cost.length > 0 && (
                                                <div className="flex gap-1 mb-2">
                                                    {attack.cost.map((cost, costIndex) => (
                                                        <span key={costIndex} className={`px-2 py-1 rounded text-xs
                                                                                       ${getTypeColor(cost)}`}>
                                                            {cost}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {attack.text && (
                                                <p className="text-white/70 text-sm">{attack.text}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resistenze e Debolezze */}
                        {(card?.resistances || card?.weaknesses) && (
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Resistenze e Debolezze</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {card?.weaknesses && card.weaknesses.length > 0 && (
                                        <div>
                                            <h3 className="text-red-400 font-medium mb-2">Debolezze</h3>
                                            {card.weaknesses.map((weakness, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-sm ${getTypeColor(weakness.type)}`}>
                                                        {weakness.type}
                                                    </span>
                                                    <span className="text-white">{weakness.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {card?.resistances && card.resistances.length > 0 && (
                                        <div>
                                            <h3 className="text-green-400 font-medium mb-2">Resistenze</h3>
                                            {card.resistances.map((resistance, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-sm ${getTypeColor(resistance.type)}`}>
                                                        {resistance.type}
                                                    </span>
                                                    <span className="text-white">{resistance.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Abilità speciali */}
                        {card?.abilities && card.abilities.length > 0 && (
                            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Abilità</h2>

                                <div className="space-y-3">
                                    {card.abilities.map((ability, index) => (
                                        <div key={index} className="border border-white/10 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-purple-400 font-medium">{ability.name}</h3>
                                                {ability.type && (
                                                    <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                                                        {ability.type}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/70 text-sm">{ability.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ✅ FUNZIONALITÀ EXTRA */}
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Strumenti</h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 py-3 px-4
                                             backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 
                                             text-blue-300 rounded-lg hover:bg-blue-500/30 
                                             transition-all duration-200"
                                >
                                    <ShareIcon className="w-4 h-4" />
                                    Condividi Carta
                                </button>

                                <button
                                    onClick={() => window.open(`https://www.pokellector.com/cards?search=${encodeURIComponent(card?.name)}`, '_blank')}
                                    className="flex items-center justify-center gap-2 py-3 px-4
                                             backdrop-blur-xl bg-green-500/20 border border-green-400/30 
                                             text-green-300 rounded-lg hover:bg-green-500/30 
                                             transition-all duration-200"
                                >
                                    💰 Valore Carta
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-white/60 text-sm">
                                    Carta {allCards.findIndex(c => c.id === cardId) + 1} di {allCards.length} nella collezione
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ MODAL IMMAGINE INGRANDITA */}
                {showFullImage && imageUrl && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setShowFullImage(false)}>
                        <div className="relative max-w-4xl max-h-full">
                            <img
                                src={imageUrl}
                                alt={card?.name}
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={() => setShowFullImage(false)}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardDetailPage;
