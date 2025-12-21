/**
 * Main application entry point
 */

import { FileHandler } from './utils/file-handler.js';
import { Storage } from './utils/storage.js';
import { Sidebar } from './ui/sidebar.js';
import { ChatView } from './ui/chat-view.js';
import { exportConversations, generateFilename } from './utils/export.js';

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
     * @param {boolean} persist - Whether to save to storage (default: true)
     */
    async addConversations(conversations, persist = true) {
        // Merge new conversations, avoiding duplicates by ID
        const existingIds = new Set(this.conversations.map(c => c.id));
        const newConversations = conversations.filter(c => !existingIds.has(c.id));

        this.conversations = [...this.conversations, ...newConversations];

        // Save to storage only if persist is true
        if (persist) {
            await Storage.saveConversations(this.conversations);
        }

        this.emit('conversations-updated', this.conversations);

        return newConversations.length;
    }

    /**
     * Replace all conversations (for non-persistent URL imports)
     * @param {Array} conversations - Array of conversation objects
     */
    replaceConversations(conversations) {
        this.conversations = conversations;
        this.emit('conversations-updated', this.conversations);
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

    async init() {
        // Wire up event handlers
        this.setupEventHandlers();

        // Check for URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const importUrl = urlParams.get('url');

        if (importUrl) {
            // Auto-load from URL parameter
            const urlInput = document.getElementById('url-input');
            if (urlInput) {
                urlInput.value = importUrl;
                this.fileHandler.handleUrlLoad();
            }
        } else {
            // Load conversations from storage only if no URL parameter
            const savedConversations = await Storage.loadConversations();
            if (savedConversations.length > 0) {
                this.state.conversations = savedConversations;
                this.sidebar.render(savedConversations);
            }
        }
    }

    setupEventHandlers() {
        // Listen for file drops
        document.addEventListener('conversations-loaded', async (e) => {
            const { conversations, source, fromUrl } = e.detail;

            if (fromUrl) {
                // Replace conversations without persisting to storage
                this.state.replaceConversations(conversations);
                console.log(`Loaded ${conversations.length} conversation(s) from URL (not persisted)`);
            } else {
                // Add conversations and persist to storage
                const newCount = await this.state.addConversations(conversations);

                if (newCount > 0) {
                    console.log(`Added ${newCount} new conversation(s) from ${source}`);
                } else {
                    console.log('All conversations from this file were already loaded');
                }
            }
        });

        // Listen for state changes
        this.state.on('conversations-updated', (conversations) => {
            this.sidebar.render(conversations);

            // Auto-select first conversation if none selected
            if (!this.state.currentConversationId && conversations.length > 0) {
                this.state.selectConversation(conversations[0].id);
            }

            // Show/hide export all button
            const exportAllBtn = document.getElementById('export-all-btn');
            if (exportAllBtn) {
                exportAllBtn.style.display = conversations.length > 0 ? 'block' : 'none';
            }
        });

        this.state.on('conversation-selected', (conversation) => {
            // Pass search query to chat view for highlighting
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                this.chatView.setSearchQuery(searchInput.value);
            }
            this.chatView.render(conversation);

            // Show/hide export current button
            const exportCurrentBtn = document.getElementById('export-current-btn');
            if (exportCurrentBtn) {
                exportCurrentBtn.style.display = conversation ? 'block' : 'none';
            }
        });

        // Listen for sidebar selection
        this.sidebar.onSelect((conversationId) => {
            this.state.selectConversation(conversationId);
        });

        // Listen for selection changes
        this.sidebar.onSelectionChange((selectedIds) => {
            const exportSelectedBtn = document.getElementById('export-selected-btn');
            const selectionControls = document.getElementById('selection-controls');

            if (exportSelectedBtn) {
                exportSelectedBtn.style.display = selectedIds.length > 0 ? 'block' : 'none';
            }
            if (selectionControls) {
                selectionControls.style.display = this.state.getConversations().length > 0 ? 'flex' : 'none';
            }
        });

        // Export current conversation button
        const exportCurrentBtn = document.getElementById('export-current-btn');
        if (exportCurrentBtn) {
            exportCurrentBtn.addEventListener('click', () => {
                const conversation = this.state.getCurrentConversation();
                if (conversation) {
                    const filename = generateFilename(conversation);
                    exportConversations(conversation, filename);
                    console.log(`Exported conversation: ${conversation.title}`);
                }
            });
        }

        // Export selected conversations button
        const exportSelectedBtn = document.getElementById('export-selected-btn');
        if (exportSelectedBtn) {
            exportSelectedBtn.addEventListener('click', () => {
                const selectedIds = this.sidebar.getSelectedIds();
                if (selectedIds.length > 0) {
                    const selectedConversations = this.state.getConversations()
                        .filter(conv => selectedIds.includes(conv.id));
                    const filename = generateFilename(selectedConversations);
                    exportConversations(selectedConversations, filename);
                    console.log(`Exported ${selectedConversations.length} selected conversation(s)`);
                }
            });
        }

        // Export all conversations button
        const exportAllBtn = document.getElementById('export-all-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                const conversations = this.state.getConversations();
                if (conversations.length > 0) {
                    const filename = generateFilename(conversations);
                    exportConversations(conversations, filename);
                    console.log(`Exported ${conversations.length} conversation(s)`);
                }
            });
        }

        // Select all button
        const selectAllBtn = document.getElementById('select-all-btn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.sidebar.selectAll();
            });
        }

        // Select none button
        const selectNoneBtn = document.getElementById('select-none-btn');
        if (selectNoneBtn) {
            selectNoneBtn.addEventListener('click', () => {
                this.sidebar.clearSelection();
            });
        }
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
