/**
 * Storage wrapper for persisting conversations
 * Uses IndexedDB for large storage capacity
 */

import { indexedDBStorage, IndexedDBWrapper } from './indexeddb.js';

const STORAGE_KEY = 'llm-conversations';

export class Storage {
    /**
     * Save conversations to IndexedDB
     * @param {Array} conversations - Array of conversation objects
     * @returns {Promise<boolean>}
     */
    static async saveConversations(conversations) {
        return await indexedDBStorage.saveConversations(conversations);
    }

    /**
     * Load conversations from IndexedDB
     * @returns {Promise<Array>} - Array of conversation objects, or empty array if none found
     */
    static async loadConversations() {
        const conversations = await indexedDBStorage.loadConversations();

        // If IndexedDB is empty, try migrating from localStorage
        if (conversations.length === 0) {
            const localConversations = this._loadFromLocalStorage();
            if (localConversations.length > 0) {
                console.log('Migrating conversations from localStorage to IndexedDB...');
                await indexedDBStorage.saveConversations(localConversations);
                // Clear localStorage after successful migration
                localStorage.removeItem(STORAGE_KEY);
                return localConversations;
            }
        }

        return conversations;
    }

    /**
     * Load conversations from localStorage (migration helper)
     * @private
     */
    static _loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return [];
            }

            const conversations = JSON.parse(data);

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
            console.error('Error loading conversations from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    }

    /**
     * Clear all conversations from storage
     * @returns {Promise<void>}
     */
    static async clearConversations() {
        await indexedDBStorage.clearConversations();
        // Also clear localStorage for cleanup
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Check if storage is available
     * @returns {boolean}
     */
    static isAvailable() {
        return IndexedDBWrapper.isAvailable();
    }

    /**
     * Get approximate size of stored data in bytes
     * @returns {Promise<number>}
     */
    static async getStorageSize() {
        return await indexedDBStorage.getStorageSize();
    }
}
