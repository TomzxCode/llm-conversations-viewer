/**
 * Conversation format parsers for OpenAI and Claude exports
 */

/**
 * Detect the format of a conversation JSON
 * @param {Array} data - Parsed JSON data
 * @returns {string} - 'openai', 'claude', or 'unknown'
 */
export function detectFormat(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid conversation format: expected non-empty array');
    }

    const first = data[0];

    // OpenAI format has mapping and current_node
    if (first.mapping && first.current_node) {
        return 'openai';
    }

    // Claude format has chat_messages and uuid
    if (first.chat_messages && first.uuid) {
        return 'claude';
    }

    throw new Error('Unknown conversation format');
}

/**
 * Parse OpenAI conversation format
 * Extracts the current conversation path by walking from current_node backwards
 * @param {Array} data - OpenAI conversation array
 * @returns {Array} - Array of normalized conversations
 */
export function parseOpenAI(data) {
    return data.map(conv => {
        const messages = [];
        let nodeId = conv.current_node;

        // Walk backwards from current_node to root
        while (nodeId) {
            const node = conv.mapping[nodeId];
            if (!node) break;

            // Only include messages that exist and aren't hidden
            if (node.message) {
                const isHidden = node.message.metadata?.is_visually_hidden_from_conversation;
                const hasContent = node.message.content?.parts?.[0];

                if (!isHidden && hasContent) {
                    messages.unshift({
                        id: node.message.id,
                        role: node.message.author.role,
                        content: node.message.content.parts.join('\n'),
                        timestamp: new Date(node.message.create_time * 1000),
                        metadata: {
                            model: node.message.metadata?.model_slug,
                            status: node.message.status
                        }
                    });
                }
            }

            nodeId = node.parent;
        }

        return {
            id: conv.conversation_id || conv.id,
            title: conv.title || 'Untitled Conversation',
            created: new Date(conv.create_time * 1000),
            updated: new Date(conv.update_time * 1000),
            format: 'openai',
            messages
        };
    });
}

/**
 * Parse Claude conversation format
 * Transforms linear chat_messages array to normalized format
 * @param {Array} data - Claude conversation array
 * @returns {Array} - Array of normalized conversations
 */
export function parseClaude(data) {
    return data.map(conv => {
        const messages = conv.chat_messages.map(msg => ({
            id: msg.uuid,
            role: msg.sender === 'human' ? 'user' : 'assistant',
            content: msg.content
                .filter(c => c.type === 'text')
                .map(c => c.text)
                .join('\n'),
            timestamp: new Date(msg.created_at),
            metadata: {
                attachments: msg.attachments,
                files: msg.files
            }
        }));

        return {
            id: conv.uuid,
            title: conv.name || 'Untitled Conversation',
            created: new Date(conv.created_at),
            updated: new Date(conv.updated_at),
            format: 'claude',
            summary: conv.summary,
            messages
        };
    });
}

/**
 * Main parsing function - auto-detects format and returns normalized conversations
 * @param {Array} data - Raw conversation JSON data
 * @returns {Array} - Array of normalized conversations
 */
export function parseConversations(data) {
    const format = detectFormat(data);

    switch (format) {
        case 'openai':
            return parseOpenAI(data);
        case 'claude':
            return parseClaude(data);
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
