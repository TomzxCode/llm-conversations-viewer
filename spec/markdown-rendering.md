# Markdown Rendering Specification

## Overview
This specification defines the requirements for rendering markdown content in conversation messages using the marked.js library and highlight.js for code syntax highlighting.

## Requirements

### Markdown Processing
- The system MUST use marked.js for markdown parsing
- The system MUST support GitHub Flavored Markdown (GFM)
- The system MUST convert line breaks to `<br>` tags
- The system MUST NOT add IDs to headers
- The system MUST NOT mangle email addresses
- The system MUST handle empty input gracefully (return empty string)

### Code Block Highlighting
- The system MUST use highlight.js for code syntax highlighting
- The system MUST support language-specific highlighting when a language is specified
- The system MUST fall back to auto-detection when no language is specified
- The system MUST handle highlighting errors gracefully
- The system MUST return the original code if highlighting fails
- The system MUST log highlighting errors to console

### Code Block Format
- Code blocks with language MUST use format: ```language
- Code blocks without language MUST use format: ```
- The system MUST pass the code content and language to highlight.js
- The system MUST use the `hljs.highlight` method for specified languages
- The system MUST use the `hljs.highlightAuto` method for auto-detection

### Error Handling
- The system MUST catch markdown parsing errors
- The system MUST log markdown errors to console
- On markdown error, the system MUST fall back to plain text with line breaks
- The system MUST catch highlighting errors
- The system MUST log highlighting errors to console
- On highlighting error, the system MUST return original code

### HTML Escaping
- The system MUST provide a function to escape HTML for displaying raw text
- The escape function MUST use `textContent` for proper escaping
- The escape function MUST return escaped HTML string
- This function MUST be used when displaying non-markdown text

### Rendering API
- The system MUST provide a `renderMarkdown(text)` function
- The function MUST accept a markdown string
- The function MUST return an HTML string
- The function MUST return empty string for null/undefined input
- The system MUST provide an `escapeHtml(text)` function

### Marked.js Configuration
- marked.js MUST be configured before first use
- The `highlight` option MUST be set to use highlight.js
- The `breaks` option MUST be set to `true`
- The `gfm` option MUST be set to `true`
- The `headerIds` option MUST be set to `false`
- The `mangle` option MUST be set to `false`

### Security
- The system MUST sanitize markdown to prevent XSS attacks
- The system MUST escape user content before markdown processing
- The system MUST not allow arbitrary HTML in markdown (handled by marked.js)
- The system MUST not execute scripts embedded in markdown

### Performance
- The system MUST handle large markdown documents efficiently
- The system MUST not block the UI during rendering
- The system SHOULD cache rendered output for repeated content (optional)

### Extensibility
- The system configuration MUST support additional marked.js options
- The system MUST support adding new highlight.js languages
- The system architecture MUST support switching markdown libraries

### Integration
- The markdown renderer MUST be used by the chat view component
- The markdown renderer MUST be integrated with message rendering
- The markdown renderer MUST support search highlighting (applied after rendering)
- The markdown renderer MUST preserve code block structure for search highlighting

### Language Support
- The system MUST support all languages provided by highlight.js
- The system MUST properly detect common languages (JavaScript, Python, etc.)
- The system MUST handle unknown language codes gracefully
- The system MUST apply syntax highlighting CSS classes

### Output Format
- Rendered HTML MUST be valid HTML5
- Code blocks MUST be wrapped in `<pre><code>` elements
- Code elements MUST have language classes (e.g., `language-javascript`)
- The system MUST preserve whitespace in code blocks
- The system MUST preserve line breaks in text content

### Accessibility
- Code blocks SHOULD maintain proper semantic structure
- The system SHOULD preserve heading hierarchy
- The system SHOULD not interfere with screen readers
