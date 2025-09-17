// src/services/tcgCache.js - SISTEMA CACHE INTELLIGENTE
class TCGCache {
    constructor() {
        this.memoryCache = new Map();
        this.localStoragePrefix = 'tcg_cache_';
        this.maxMemoryEntries = 100;
        this.defaultTTL = 5 * 60 * 1000; // 5 minuti
    }

    // ✅ GENERA CHIAVE CACHE
    generateKey(endpoint, language, params = {}) {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');

        return `${language}:${endpoint}${paramString ? '?' + paramString : ''}`;
    }

    // ✅ GET DA CACHE
    get(key) {
        // Prima controlla memoria
        const memoryEntry = this.memoryCache.get(key);
        if (this.isValidEntry(memoryEntry)) {
            return memoryEntry.data;
        }

        // Poi controlla localStorage
        try {
            const storageKey = this.localStoragePrefix + key;
            const storageEntry = JSON.parse(localStorage.getItem(storageKey) || 'null');

            if (this.isValidEntry(storageEntry)) {
                // Riporta in memoria per accesso rapido
                this.memoryCache.set(key, storageEntry);
                return storageEntry.data;
            }
        } catch (error) {
            console.warn('Cache localStorage error:', error);
        }

        return null;
    }

    // ✅ SET IN CACHE
    set(key, data, ttl = this.defaultTTL) {
        const entry = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };

        // Salva in memoria
        this.memoryCache.set(key, entry);

        // Limita size memoria cache
        if (this.memoryCache.size > this.maxMemoryEntries) {
            const firstKey = this.memoryCache.keys().next().value;
            this.memoryCache.delete(firstKey);
        }

        // Salva in localStorage (con gestione errori)
        try {
            const storageKey = this.localStoragePrefix + key;
            localStorage.setItem(storageKey, JSON.stringify(entry));
        } catch (error) {
            // localStorage pieno o non disponibile
            console.warn('Cannot save to localStorage:', error);
        }
    }

    // ✅ VALIDA ENTRY CACHE
    isValidEntry(entry) {
        if (!entry || !entry.timestamp) return false;

        const age = Date.now() - entry.timestamp;
        const maxAge = entry.ttl || this.defaultTTL;

        return age < maxAge;
    }

    // ✅ CLEAR CACHE
    clear() {
        this.memoryCache.clear();

        // Clear localStorage entries
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.localStoragePrefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Error clearing localStorage cache:', error);
        }
    }

    // ✅ STATS CACHE
    getStats() {
        const memorySize = this.memoryCache.size;

        let localStorageSize = 0;
        try {
            const keys = Object.keys(localStorage);
            localStorageSize = keys.filter(key =>
                key.startsWith(this.localStoragePrefix)
            ).length;
        } catch (error) {
            // localStorage non disponibile
        }

        return {
            memory: memorySize,
            localStorage: localStorageSize,
            maxMemory: this.maxMemoryEntries
        };
    }

    // ✅ CLEANUP EXPIRED ENTRIES
    cleanup() {
        // Cleanup memoria
        for (const [key, entry] of this.memoryCache.entries()) {
            if (!this.isValidEntry(entry)) {
                this.memoryCache.delete(key);
            }
        }

        // Cleanup localStorage
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.localStoragePrefix)) {
                    try {
                        const entry = JSON.parse(localStorage.getItem(key) || 'null');
                        if (!this.isValidEntry(entry)) {
                            localStorage.removeItem(key);
                        }
                    } catch (error) {
                        // Entry corrotta, rimuovila
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.warn('Error during cache cleanup:', error);
        }
    }
}

// ✅ SINGLETON INSTANCE
export const tcgCache = new TCGCache();

// ✅ AUTO CLEANUP OGNI 10 MINUTI
setInterval(() => {
    tcgCache.cleanup();
}, 10 * 60 * 1000);

export default tcgCache;
