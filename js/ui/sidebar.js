/**
 * Sidebar component for displaying conversation list
 */

export class Sidebar {
    constructor(container) {
        this.container = container;
        this.currentConversationId = null;
        this.onSelectCallback = null;
    }

    /**
     * Register callback for conversation selection
     * @param {Function} callback - Called with conversation ID when selected
     */
    onSelect(callback) {
        this.onSelectCallback = callback;
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

        // Sort by updated date (most recent first)
        const sorted = [...conversations].sort((a, b) => b.updated - a.updated);

        this.container.innerHTML = '';

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

        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-start mb-1">
                <h6 class="mb-1 conversation-title">${this.escapeHtml(conversation.title)}</h6>
                ${formatBadge}
            </div>
            <div class="d-flex w-100 justify-content-between">
                <small class="text-muted">${messageCount} messages</small>
                <small class="text-muted">${dateStr}</small>
            </div>
        `;

        // Click handler
        item.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectConversation(conversation.id);
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
}
