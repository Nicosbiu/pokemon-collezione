// src/components/APITester.jsx - VERSIONE CORRETTA
import { useState } from 'react';
import { PokemonAPI } from '../services/pokemonAPI';

function APITester() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en');

    const testAPI = async (testType) => {
        setLoading(true);
        try {
            let data;

            switch (testType) {
                case 'connection':
                    data = await PokemonAPI.testConnection(language);
                    break;
                case 'sets':
                    data = await PokemonAPI.getSetsByLanguage(language);
                    break;
                case 'cards':
                    // Usa il primo set disponibile
                    const setsData = await PokemonAPI.getSetsByLanguage(language);
                    if (setsData.data && setsData.data.length > 0) {
                        const setId = setsData.data[0].id;
                        data = await PokemonAPI.getCardsBySet(setId, language, 1, 4);
                    } else {
                        data = { error: 'No sets available to get cards from' };
                    }
                    break;
                case 'search':
                    data = await PokemonAPI.searchCards('Pikachu', language, 5);
                    break;
                case 'random':
                    data = await PokemonAPI.getRandomCard(language);
                    break;
                case 'series':
                    data = await PokemonAPI.getSeries(language);
                    break;
                case 'cache':
                    data = PokemonAPI.getCacheStats();
                    break;
                default:
                    data = { error: 'Unknown test type' };
            }

            setResults({ type: testType, data, timestamp: new Date(), language });
        } catch (error) {
            setResults({ type: testType, error: error.message, timestamp: new Date(), language });
        }
        setLoading(false);
    };

    return (
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                    rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
                TCGdex Official SDK Tester ⚡
            </h2>

            {/* Language Selector */}
            <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Language / Lingua / 言語</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] 
                     rounded-lg px-3 py-2 text-white
                     [&>option]:bg-gray-800 [&>option]:text-white"
                >
                    <option value="en">🇺🇸 English</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="ja">🇯🇵 日本語</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="de">🇩🇪 Deutsch</option>
                </select>
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <button
                    onClick={() => testAPI('connection')}
                    disabled={loading}
                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    🔗 Connection
                </button>
                <button
                    onClick={() => testAPI('sets')}
                    disabled={loading}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    📦 Sets
                </button>
                <button
                    onClick={() => testAPI('cards')}
                    disabled={loading}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    🎴 Cards
                </button>
                <button
                    onClick={() => testAPI('search')}
                    disabled={loading}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    🔎 Search
                </button>
                <button
                    onClick={() => testAPI('random')}
                    disabled={loading}
                    className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    🎲 Random
                </button>
                <button
                    onClick={() => testAPI('series')}
                    disabled={loading}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    📚 Series
                </button>
                <button
                    onClick={() => testAPI('cache')}
                    disabled={loading}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                    📊 Cache
                </button>
                <button
                    onClick={() => PokemonAPI.clearCache()}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded transition-colors text-sm"
                >
                    🗑️ Clear
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center gap-2 text-white/70 mb-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Testing {language.toUpperCase()} SDK...
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="bg-black/20 rounded-lg p-4 overflow-auto max-h-96">
                    <div className="text-white/70 text-sm mb-2 flex justify-between flex-wrap gap-2">
                        <span>Test: <span className="text-white font-medium">{results.type}</span></span>
                        <span>Lang: <span className="text-white font-medium">{results.language}</span></span>
                        <span>Time: {results.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-white/90 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                        {JSON.stringify(results.data || results.error, null, 2)}
                    </pre>
                </div>
            )}

            {/* Info */}
            <div className="mt-4 text-white/50 text-xs">
                Using TCGdex Official JavaScript SDK - Native Multilingual Support 🌍
                <br />
                <a href="https://tcgdex.dev/sdks/javascript" target="_blank" rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline">
                    View Documentation
                </a>
            </div>
        </div>
    );
}

export default APITester;
