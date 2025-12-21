/**
 * Platform URL generator for conversation links
 */

/**
 * Generate a URL to continue the conversation on the respective platform
 * @param {Object} conversation - Normalized conversation object
 * @returns {string|null} - Platform URL or null if not supported
 */
export function getPlatformUrl(conversation) {
    if (!conversation || !conversation.id || !conversation.format) {
        return null;
    }

    switch (conversation.format) {
        case 'openai':
            return `https://chatgpt.com/c/${conversation.id}`;
        case 'claude':
            return `https://claude.ai/chat/${conversation.id}`;
        default:
            return null;
    }
}

/**
 * Get the platform display name
 * @param {string} format - Conversation format
 * @returns {string} - Platform name
 */
export function getPlatformName(format) {
    const names = {
        'openai': 'ChatGPT',
        'claude': 'Claude'
    };
    return names[format] || 'Unknown Platform';
}
