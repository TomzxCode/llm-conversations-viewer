/**
 * Main application entry point
 */

import { FileHandler } from './utils/file-handler.js';
import { Storage } from './utils/storage.js';
import { Sidebar } from './ui/sidebar.js';
import { ChatView } from './ui/chat-view.js';

/**
 * Application State Manager
 */
class AppState {
    constructor() {
        this.conversations = [];
        this.currentConversationId = null;
        this.listeners = {};
    }

    /**
     * Add conversations to state
     * @param {Array} conversations - Array of conversation objects
     */
    addConversations(conversations) {
        // Merge new conversations, avoiding duplicates by ID
        const existingIds = new Set(this.conversations.map(c => c.id));
        const newConversations = conversations.filter(c => !existingIds.has(c.id));

        this.conversations = [...this.conversations, ...newConversations];

        // Save to localStorage
        Storage.saveConversations(this.conversations);

        this.emit('conversations-updated', this.conversations);

        return newConversations.length;
    }

    /**
     * Select a conversation
     * @param {string} id - Conversation ID
     */
    selectConversation(id) {
        this.currentConversationId = id;
        this.emit('conversation-selected', this.getCurrentConversation());
    }

    /**
     * Get current conversation
     * @returns {Object|null}
     */
    getCurrentConversation() {
        return this.conversations.find(c => c.id === this.currentConversationId) || null;
    }

    /**
     * Get all conversations
     * @returns {Array}
     */
    getConversations() {
        return this.conversations;
    }

    /**
     * Register event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

/**
 * Main Application Class
 */
class App {
    constructor() {
        this.state = new AppState();
        this.fileHandler = new FileHandler();
        this.sidebar = new Sidebar(document.getElementById('sidebar-content'));
        this.chatView = new ChatView(document.getElementById('chat-content'));

        this.init();
    }

    init() {
        // Load conversations from localStorage
        const savedConversations = Storage.loadConversations();
        if (savedConversations.length > 0) {
            this.state.conversations = savedConversations;
            this.sidebar.render(savedConversations);
        }

        // Wire up event handlers
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Listen for file drops
        document.addEventListener('conversations-loaded', (e) => {
            const { conversations, source } = e.detail;
            const newCount = this.state.addConversations(conversations);

            if (newCount > 0) {
                console.log(`Added ${newCount} new conversation(s) from ${source}`);
            } else {
                console.log('All conversations from this file were already loaded');
            }
        });

        // Listen for state changes
        this.state.on('conversations-updated', (conversations) => {
            this.sidebar.render(conversations);

            // Auto-select first conversation if none selected
            if (!this.state.currentConversationId && conversations.length > 0) {
                this.state.selectConversation(conversations[0].id);
            }
        });

        this.state.on('conversation-selected', (conversation) => {
            // Pass search query to chat view for highlighting
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                this.chatView.setSearchQuery(searchInput.value);
            }
            this.chatView.render(conversation);
        });

        // Listen for sidebar selection
        this.sidebar.onSelect((conversationId) => {
            this.state.selectConversation(conversationId);
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}
