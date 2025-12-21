/**
 * Chat view component for rendering conversation messages
 */

import { renderMarkdown } from './markdown.js';

export class ChatView {
    constructor(container) {
        this.container = container;
        this.titleElement = document.getElementById('chat-title');
        this.metaElement = document.getElementById('chat-meta');
    }

    /**
     * Render a conversation in the chat view
     * @param {Object} conversation - Normalized conversation object
     */
    render(conversation) {
        if (!conversation) {
            this.renderEmpty();
            return;
        }

        // Update header
        this.titleElement.textContent = conversation.title;

        const formatBadge = this.getFormatBadge(conversation.format);
        const dateStr = this.formatDate(conversation.updated);
        this.metaElement.innerHTML = `${formatBadge} <span class="text-muted">•</span> ${dateStr} <span class="text-muted">•</span> ${conversation.messages.length} messages`;

        // Clear container and render messages
        this.container.innerHTML = '';

        if (conversation.messages.length === 0) {
            this.container.innerHTML = '<div class="text-center text-muted py-5">No messages in this conversation</div>';
            return;
        }

        const messagesContainer = document.createElement('div');
        messagesContainer.className = 'messages-container';

        conversation.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        this.container.appendChild(messagesContainer);

        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Create a message element
     * @param {Object} message - Message object
     * @returns {HTMLElement}
     */
    createMessageElement(message) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper message-${message.role}`;

        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${message.role}`;

        // Render markdown content
        const contentHtml = renderMarkdown(message.content);
        bubble.innerHTML = contentHtml;

        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = this.formatTimestamp(message.timestamp);

        wrapper.appendChild(bubble);
        wrapper.appendChild(timestamp);

        return wrapper;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.titleElement.textContent = 'Welcome';
        this.metaElement.textContent = '';

        this.container.innerHTML = `
            <div class="empty-state text-center py-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-chat-dots text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 2.913-6 7-6s7 2.808 7 6c0 3.193-2.913 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                </svg>
                <h3 class="text-muted">Select a conversation</h3>
                <p class="text-muted">Choose a conversation from the sidebar to view messages</p>
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
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * Format timestamp for message
     * @param {Date} timestamp
     * @returns {string}
     */
    formatTimestamp(timestamp) {
        return timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
