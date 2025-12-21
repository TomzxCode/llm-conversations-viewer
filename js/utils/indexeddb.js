/**
 * IndexedDB wrapper for persisting conversations
 * Provides much larger storage capacity than localStorage (typically 100MB+)
 */

const DB_NAME = 'llm-conversations-db';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

class IndexedDBWrapper {
    constructor() {
        this.db = null;
        this.initPromise = null;
    }

    /**
     * Initialize the database
     * @returns {Promise<IDBDatabase>}
     */
    async init() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    // Create indexes for efficient querying
                    objectStore.createIndex('created', 'created', { unique: false });
                    objectStore.createIndex('updated', 'updated', { unique: false });
                    objectStore.createIndex('title', 'title', { unique: false });
                }
            };
        });

        return this.initPromise;
    }

    /**
     * Save all conversations
     * @param {Array} conversations - Array of conversation objects
     * @returns {Promise<boolean>}
     */
    async saveConversations(conversations) {
        try {
            await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);

                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => reject(transaction.error);
                transaction.onabort = () => reject(new Error('Transaction aborted'));

                // Clear existing conversations
                objectStore.clear();

                // Add all conversations
                for (const conversation of conversations) {
                    objectStore.add(conversation);
                }
            });
        } catch (error) {
            console.error('Error saving conversations to IndexedDB:', error);
            return false;
        }
    }

    /**
     * Load all conversations
     * @returns {Promise<Array>}
     */
    async loadConversations() {
        try {
            await this.init();

            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const conversations = await this._promisifyRequest(objectStore.getAll());

            // Re-parse date strings back to Date objects
            return conversations.map(conv => ({
                ...conv,
                created: new Date(conv.created),
                updated: new Date(conv.updated),
                messages: conv.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
        } catch (error) {
            console.error('Error loading conversations from IndexedDB:', error);
            return [];
        }
    }

    /**
     * Clear all conversations
     * @returns {Promise<void>}
     */
    async clearConversations() {
        try {
            await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);

                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
                transaction.onabort = () => reject(new Error('Transaction aborted'));

                objectStore.clear();
            });
        } catch (error) {
            console.error('Error clearing conversations from IndexedDB:', error);
        }
    }

    /**
     * Check if IndexedDB is available
     * @returns {boolean}
     */
    static isAvailable() {
        return 'indexedDB' in window;
    }

    /**
     * Get approximate size of stored data
     * @returns {Promise<number>} Size in bytes
     */
    async getStorageSize() {
        try {
            const conversations = await this.loadConversations();
            const data = JSON.stringify(conversations);
            return new Blob([data]).size;
        } catch (error) {
            console.error('Error calculating storage size:', error);
            return 0;
        }
    }

    /**
     * Helper to promisify IndexedDB requests
     * @private
     */
    _promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Export class and singleton instance
export { IndexedDBWrapper };
export const indexedDBStorage = new IndexedDBWrapper();
