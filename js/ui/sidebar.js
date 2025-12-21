/**
 * Sidebar component for displaying conversation list
 */

export class Sidebar {
    constructor(container) {
        this.container = container;
        this.currentConversationId = null;
        this.onSelectCallback = null;
        this.onSelectionChangeCallback = null;
        this.allConversations = [];
        this.searchQuery = '';
        this.selectedIds = new Set();
        this.setupSearchInput();
    }

    /**
     * Setup search input event listener
     */
    setupSearchInput() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.render(this.allConversations);
            });
        }
    }

    /**
     * Register callback for conversation selection
     * @param {Function} callback - Called with conversation ID when selected
     */
    onSelect(callback) {
        this.onSelectCallback = callback;
    }

    /**
     * Register callback for selection changes
     * @param {Function} callback - Called with array of selected IDs
     */
    onSelectionChange(callback) {
        this.onSelectionChangeCallback = callback;
    }

    /**
     * Get selected conversation IDs
     * @returns {Array<string>}
     */
    getSelectedIds() {
        return Array.from(this.selectedIds);
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        this.selectedIds.clear();
        this.updateSelectionUI();
        this.notifySelectionChange();
    }

    /**
     * Select all visible conversations
     */
    selectAll() {
        const filtered = this.getFilteredConversations();
        filtered.forEach(conv => this.selectedIds.add(conv.id));
        this.updateSelectionUI();
        this.notifySelectionChange();
    }

    /**
     * Get filtered conversations based on search
     */
    getFilteredConversations() {
        if (!this.searchQuery) {
            return this.allConversations;
        }
        return this.allConversations.filter(conv => this.matchesSearch(conv));
    }

    /**
     * Notify listeners of selection change
     */
    notifySelectionChange() {
        if (this.onSelectionChangeCallback) {
            this.onSelectionChangeCallback(this.getSelectedIds());
        }
    }

    /**
     * Update checkbox UI states
     */
    updateSelectionUI() {
        this.container.querySelectorAll('.conversation-checkbox').forEach(checkbox => {
            const convId = checkbox.dataset.conversationId;
            checkbox.checked = this.selectedIds.has(convId);
        });
    }

    /**
     * Render the list of conversations
     * @param {Array} conversations - Array of conversation objects
     */
    render(conversations) {
        if (!conversations || conversations.length === 0) {
            this.renderEmpty();
            return;
        }

        // Store all conversations for filtering
        this.allConversations = conversations;

        // Filter conversations based on search query
        let filtered = conversations;
        if (this.searchQuery) {
            filtered = conversations.filter(conv => this.matchesSearch(conv));
        }

        // Sort by updated date (most recent first)
        const sorted = [...filtered].sort((a, b) => b.updated - a.updated);

        this.container.innerHTML = '';

        if (sorted.length === 0) {
            this.renderNoResults();
            return;
        }

        const listGroup = document.createElement('div');
        listGroup.className = 'list-group list-group-flush';

        sorted.forEach(conv => {
            const item = this.createConversationItem(conv);
            listGroup.appendChild(item);
        });

        this.container.appendChild(listGroup);
    }

    /**
     * Create a conversation list item
     * @param {Object} conversation - Conversation object
     * @returns {HTMLElement}
     */
    createConversationItem(conversation) {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action conversation-item';
        item.dataset.conversationId = conversation.id;

        if (conversation.id === this.currentConversationId) {
            item.classList.add('active');
        }

        // Format badge
        const formatBadge = this.getFormatBadge(conversation.format);

        // Date
        const dateStr = this.formatDate(conversation.updated);

        // Message count
        const messageCount = conversation.messages.length;

        // Checkbox state
        const isChecked = this.selectedIds.has(conversation.id);

        item.innerHTML = `
            <div class="d-flex w-100 align-items-start gap-2">
                <input type="checkbox" class="form-check-input conversation-checkbox mt-1 flex-shrink-0"
                       data-conversation-id="${conversation.id}"
                       ${isChecked ? 'checked' : ''}
                       onclick="event.stopPropagation()">
                <div class="flex-grow-1" style="min-width: 0;">
                    <div class="d-flex w-100 justify-content-between align-items-start mb-1">
                        <h6 class="mb-1 conversation-title text-truncate">${this.highlightMatches(conversation.title)}</h6>
                        ${formatBadge}
                    </div>
                    <div class="d-flex w-100 justify-content-between">
                        <small class="text-muted">${messageCount} messages</small>
                        <small class="text-muted">${dateStr}</small>
                    </div>
                </div>
            </div>
        `;

        // Click handler for conversation selection
        item.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectConversation(conversation.id);
        });

        // Checkbox handler
        const checkbox = item.querySelector('.conversation-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (e.target.checked) {
                this.selectedIds.add(conversation.id);
            } else {
                this.selectedIds.delete(conversation.id);
            }
            this.notifySelectionChange();
        });

        return item;
    }

    /**
     * Select a conversation
     * @param {string} conversationId
     */
    selectConversation(conversationId) {
        this.currentConversationId = conversationId;

        // Update active state
        this.container.querySelectorAll('.conversation-item').forEach(item => {
            if (item.dataset.conversationId === conversationId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Call callback
        if (this.onSelectCallback) {
            this.onSelectCallback(conversationId);
        }
    }

    /**
     * Check if conversation matches search query
     * @param {Object} conversation - Conversation object
     * @returns {boolean}
     */
    matchesSearch(conversation) {
        const query = this.searchQuery.toLowerCase().trim();

        if (!query) {
            return true;
        }

        // Split query into individual words for order-independent matching
        const searchWords = query.split(/\s+/).filter(word => word.length > 0);

        // Check if all search words are present in the title
        const titleLower = conversation.title.toLowerCase();
        const titleMatches = searchWords.every(word => titleLower.includes(word));

        if (titleMatches) {
            return true;
        }

        // Search in message content - all words must be present
        if (conversation.messages && conversation.messages.length > 0) {
            return conversation.messages.some(message => {
                const content = (message.content || '').toLowerCase();
                return searchWords.every(word => content.includes(word));
            });
        }

        return false;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.container.innerHTML = `
            <div class="empty-state text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-chat-left-text text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <p class="text-muted">No conversations loaded</p>
                <p class="small">Drop a .json or .zip file to get started</p>
            </div>
        `;
    }

    /**
     * Render no search results state
     */
    renderNoResults() {
        this.container.innerHTML = `
            <div class="empty-state text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-search text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <p class="text-muted">No conversations found</p>
                <p class="small">Try a different search term</p>
            </div>
        `;
    }

    /**
     * Get format badge HTML
     * @param {string} format - 'openai' or 'claude'
     * @returns {string}
     */
    getFormatBadge(format) {
        const badges = {
            'openai': '<span class="badge bg-success">OpenAI</span>',
            'claude': '<span class="badge bg-primary">Claude</span>'
        };
        return badges[format] || '<span class="badge bg-secondary">Unknown</span>';
    }

    /**
     * Format date for display
     * @param {Date} date
     * @returns {string}
     */
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days}d ago`;
        } else if (days < 30) {
            return `${Math.floor(days / 7)}w ago`;
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @returns {string} - HTML with highlighted terms
     */
    highlightMatches(text) {
        if (!this.searchQuery) {
            return this.escapeHtml(text);
        }

        const searchWords = this.searchQuery.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);

        // Escape the text first
        let escapedText = this.escapeHtml(text);

        // Highlight each search word
        searchWords.forEach(word => {
            // Create a case-insensitive regex that matches whole occurrences
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            escapedText = escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
        });

        return escapedText;
    }

    /**
     * Escape special regex characters
     * @param {string} str
     * @returns {string}
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
