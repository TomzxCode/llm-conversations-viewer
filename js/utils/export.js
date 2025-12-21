/**
 * Export utility for conversations
 * Handles exporting conversations in the normalized format
 */

/**
 * Prepare conversation data for export
 * Converts Date objects to ISO strings for JSON serialization
 * @param {Object|Array} conversations - Single conversation or array of conversations
 * @returns {Array} - Array of conversations ready for JSON export
 */
function prepareForExport(conversations) {
    const convArray = Array.isArray(conversations) ? conversations : [conversations];

    return convArray.map(conv => ({
        id: conv.id,
        title: conv.title,
        created: conv.created.toISOString(),
        updated: conv.updated.toISOString(),
        format: conv.format,
        summary: conv.summary,
        messages: conv.messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            metadata: msg.metadata
        }))
    }));
}

/**
 * Export conversations as JSON file
 * @param {Object|Array} conversations - Single conversation or array of conversations
 * @param {string} filename - Optional filename (defaults to conversations.json)
 */
export function exportConversations(conversations, filename = 'conversations.json') {
    const data = prepareForExport(conversations);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

/**
 * Generate a filename based on conversation(s) metadata
 * @param {Object|Array} conversations - Single conversation or array of conversations
 * @returns {string} - Generated filename
 */
export function generateFilename(conversations) {
    const convArray = Array.isArray(conversations) ? conversations : [conversations];

    if (convArray.length === 1) {
        // Single conversation: use title (sanitized)
        const sanitized = convArray[0].title
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase()
            .substring(0, 50);
        return `${sanitized}.json`;
    } else {
        // Multiple conversations: use timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        return `conversations-${timestamp}.json`;
    }
}
