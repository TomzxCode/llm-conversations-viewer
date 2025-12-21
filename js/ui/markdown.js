/**
 * Markdown rendering wrapper using marked.js and highlight.js
 */

// Configure marked.js to use highlight.js for code blocks
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (error) {
                console.error('Highlight error:', error);
            }
        }
        // Auto-detect language if not specified
        try {
            return hljs.highlightAuto(code).value;
        } catch (error) {
            console.error('Auto-highlight error:', error);
            return code;
        }
    },
    breaks: true,        // Convert \n to <br>
    gfm: true,          // GitHub Flavored Markdown
    headerIds: false,   // Don't add IDs to headers
    mangle: false       // Don't escape email addresses
});

/**
 * Render markdown text to HTML
 * @param {string} text - Markdown text
 * @returns {string} - HTML string
 */
export function renderMarkdown(text) {
    if (!text) {
        return '';
    }

    try {
        return marked.parse(text);
    } catch (error) {
        console.error('Markdown rendering error:', error);
        // Fallback to plain text with line breaks
        return text.replace(/\n/g, '<br>');
    }
}

/**
 * Escape HTML to prevent XSS (for displaying raw text)
 * @param {string} text - Raw text
 * @returns {string} - Escaped HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
