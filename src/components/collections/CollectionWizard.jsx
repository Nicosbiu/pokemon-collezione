// src/components/collections/CollectionWizard.jsx
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { pokemonAPI } from '../../services/pokemonAPI';
import { collectionsService } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Step componenti
import StepScegliTipo from './wizard/StepScegliTipo';
import StepConfigStandard from './wizard/StepConfigStandard';
import StepScegliPrefill from './wizard/StepScegliPrefill';

function CollectionWizard({ onClose, onCreated }) {
    const { currentUser } = useAuth(); // ✅ Usa currentUser come negli altri componenti
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Stato globale wizard
    const [formData, setFormData] = useState({
        nome: '',
        descrizione: '',
        lingua: 'it',
        tipoCollezione: null,   // 'standard' o 'personalizzata'
        setSelezionato: null,   // oggetto set per standard
        prefill: 'vuota',      // 'vuota' | 'piena'
        cartePreview: []       // carte generate
    });

    // Avanza step
    const avanti = () => setStep(s => Math.min(s + 1, 3));
    // Torna indietro
    const indietro = () => setStep(s => Math.max(s - 1, 1));

    // Funzione per aggiornare formData
    const aggiornaFormData = (dati) => setFormData(fd => ({ ...fd, ...dati }));

    // ✅ FUNZIONE CREAZIONE COLLEZIONE + CARTE IN BATCH
    const creaCollezioneBatch = async () => {
        if (!formData.nome || !formData.tipoCollezione || !currentUser) {
            throw new Error('Dati mancanti o utente non autenticato');
        }

        try {
            setIsLoading(true);

            // ✅ Step 1: Crea collezione usando il tuo collectionsService
            const collectionData = {
                name: formData.nome,
                description: formData.descrizione,
                gameId: 'pokemon',
                language: formData.lingua
            };

            const collectionId = await collectionsService.createCollection(
                collectionData,
                currentUser.uid
            );

            console.log('✅ Collezione creata:', collectionId);

            // ✅ Step 2: Se prefill "piena", aggiungi carte in batch
            if (formData.prefill === 'piena' && formData.cartePreview.length > 0) {
                console.log(`🎴 Aggiungendo ${formData.cartePreview.length} carte...`);

                const batch = writeBatch(db);
                const cardsCollectionRef = collection(db, 'collections', collectionId, 'cards');

                formData.cartePreview.forEach(card => {
                    const cardRef = doc(cardsCollectionRef, card.id);
                    batch.set(cardRef, {
                        cardId: card.id,
                        name: card.name,
                        setId: card.set?.id || formData.setSelezionato?.id,
                        setName: card.set?.name || formData.setSelezionato?.name,
                        language: formData.lingua,
                        rarity: card.rarity || null,
                        number: card.number || card.cardNumber || null,
                        imageUrl: getCardImageUrl(card),
                        owned: true,
                        quantity: 1,
                        addedAt: serverTimestamp()
                    });
                });

                await batch.commit();
                console.log('✅ Carte aggiunte alla collezione');
            }

            // ✅ Step 3: Chiama callback di successo
            onCreated(collectionId);

        } catch (error) {
            console.error('❌ Errore creazione collezione:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Helper per URL immagine carta
    const getCardImageUrl = (card) => {
        if (card.image) {
            return typeof card.image === 'string' ? card.image : card.image.small || card.image.large;
        }
        return card.images?.small || card.images?.large || null;
    };

    // Submit finale
    const handleSubmit = async () => {
        try {
            await creaCollezioneBatch();
        } catch (error) {
            alert('Errore durante la creazione: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                      rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* ✅ HEADER */}
                <div className="flex justify-between items-center p-8 border-b border-white/[0.12]">
                    <h2 className="text-white text-xl font-semibold">
                        Crea Nuova Collezione
                        {step > 1 && (
                            <span className="text-white/50 text-sm ml-2">
                                - Passo {step} di 3
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white/70 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* ✅ CONTENT */}
                <div className="p-8">
                    {/* Step 1: Scegli tipo */}
                    {step === 1 && (
                        <StepScegliTipo
                            formData={formData}
                            aggiornaFormData={aggiornaFormData}
                            avanti={avanti}
                            onClose={onClose}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Step 2: Configura set (solo per standard) */}
                    {step === 2 && formData.tipoCollezione === 'standard' && (
                        <StepConfigStandard
                            formData={formData}
                            aggiornaFormData={aggiornaFormData}
                            avanti={avanti}
                            indietro={indietro}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Step 3: Prefill */}
                    {step === 3 && (
                        <StepScegliPrefill
                            formData={formData}
                            aggiornaFormData={aggiornaFormData}
                            onSubmit={handleSubmit}
                            indietro={indietro}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CollectionWizard;
