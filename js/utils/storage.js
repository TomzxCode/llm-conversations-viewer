/**
 * LocalStorage wrapper for persisting conversations
 */

const STORAGE_KEY = 'llm-conversations';

export class Storage {
    /**
     * Save conversations to localStorage
     * @param {Array} conversations - Array of conversation objects
     */
    static saveConversations(conversations) {
        try {
            const data = JSON.stringify(conversations);
            localStorage.setItem(STORAGE_KEY, data);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                return false;
            }
            throw error;
        }
    }

    /**
     * Load conversations from localStorage
     * @returns {Array} - Array of conversation objects, or empty array if none found
     */
    static loadConversations() {
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
     * Clear all conversations from localStorage
     */
    static clearConversations() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Check if localStorage is available and has space
     * @returns {boolean}
     */
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get approximate size of stored data in bytes
     * @returns {number}
     */
    static getStorageSize() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? new Blob([data]).size : 0;
    }
}
