# Development Guide

This guide covers how to set up a development environment and contribute to LLM Conversations Viewer.

## Development Setup

### Prerequisites

- Git
- A local web server (Python, Node.js, PHP, or any static server)
- Modern web browser with developer tools
- Text editor or IDE

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/tomzxcode/llm-conversations-viewer.git
   cd llm-conversations-viewer
   ```

2. Start a local development server:
   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser

4. Open browser DevTools (F12) to see console output and debug

## Project Structure

```
llm-conversations-viewer/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── app.js            # Main application entry
│   ├── parsers.js        # Format parsers
│   ├── ui/
│   │   ├── sidebar.js    # Sidebar component
│   │   ├── chat-view.js  # Chat display component
│   │   └── markdown.js   # Markdown renderer
│   └── utils/
│       ├── file-handler.js  # File upload handling
│       ├── storage.js       # Storage persistence wrapper
│       └── indexeddb.js    # IndexedDB implementation
├── docs/                  # Documentation (MkDocs)
└── README.md
```

## Development Workflow

### No Build Step Required

This project intentionally avoids build tools to keep it simple:

- Vanilla JavaScript (ES6 modules)
- Direct HTML/CSS/JS development
- No transpilation needed
- No bundling required

Just edit files and reload the browser!

### Browser DevTools

Use browser developer tools for:

- **Console**: Debug output and error messages
- **Network**: Monitor file loading
- **Application/Storage**: Inspect localStorage
- **Sources**: Set breakpoints in JavaScript
- **Elements**: Inspect and modify DOM

## Adding Features

### Adding a New Parser

To support a new conversation format:

1. Add detection logic in `parsers.js`:
   ```javascript
   function detectFormat(data) {
     if (isNewFormat(data)) return 'new-format';
     // ... existing detection
   }
   ```

2. Implement parser function:
   ```javascript
   export function parseNewFormat(data) {
     return {
       id: data.conversation_id,
       title: data.title,
       created: new Date(data.created),
       updated: new Date(data.updated),
       format: 'new-format',
       messages: data.messages.map(msg => ({
         id: msg.id,
         role: msg.role,
         content: msg.text,
         timestamp: new Date(msg.timestamp),
         metadata: {}
       }))
     };
   }
   ```

3. Update `parseFile()` to call your parser

### Adding UI Components

Follow the existing pattern in `js/ui/`:

1. Create new module file
2. Export functions that manipulate DOM
3. Import and use in `app.js`

Example:

```javascript
// js/ui/new-component.js
export function renderNewComponent(data, container) {
  container.innerHTML = '';
  // Build DOM elements
  const element = document.createElement('div');
  element.textContent = data.content;
  container.appendChild(element);
}
```

### Adding Utility Functions

Add to appropriate file in `js/utils/` or create new utility module.

## Code Style

### JavaScript

- Use ES6+ features (arrow functions, destructuring, modules)
- Prefer `const` over `let`, avoid `var`
- Use template literals for strings
- Add JSDoc comments for public functions
- Keep functions small and focused

Example:

```javascript
/**
 * Parses a conversation from OpenAI format
 * @param {Object} data - Raw OpenAI conversation data
 * @returns {Object} Normalized conversation object
 */
export function parseOpenAI(data) {
  // Implementation
}
```

### HTML

- Semantic HTML5 elements
- Bootstrap classes for styling
- Minimal custom classes
- Accessible markup (ARIA labels, alt text)

### CSS

- Use Bootstrap utilities first
- Custom CSS for specific needs only
- BEM naming for custom classes
- Mobile-first responsive design

## Testing

### Manual Testing

Test checklist:

- [ ] Upload OpenAI JSON file
- [ ] Upload Claude JSON file
- [ ] Upload ZIP with conversations.json
- [ ] Drag and drop files
- [ ] Select conversations from sidebar
- [ ] View messages with markdown
- [ ] View code blocks with highlighting
- [ ] Delete conversations
- [ ] Refresh page (persistence test)
- [ ] Test in multiple browsers

### Test Data

Use the provided example files:

- `openai.json` - Sample OpenAI conversation
- `claude.json` - Sample Claude conversation

### Browser Testing

Test in:

- Chrome/Chromium
- Firefox
- Safari (if on macOS)
- Edge

## Documentation

### Code Documentation

- Add JSDoc comments to all exported functions
- Document complex logic inline
- Keep comments up-to-date with code changes

### User Documentation

Documentation is built with MkDocs Material:

1. Edit markdown files in `docs/`
2. Preview locally:
   ```bash
   uv run mkdocs serve
   ```
3. Build static site:
   ```bash
   uv run mkdocs build
   ```

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test thoroughly
5. Commit with clear messages:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request on GitHub

### Commit Messages

Follow conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build or tooling changes

Example:

```
feat: add support for Gemini conversation format

- Add Gemini format detection
- Implement parseGemini function
- Update documentation
```

## Debugging

### Common Issues

**Module not found errors**

- Ensure you're using a web server, not opening file directly
- Check file paths are correct (case-sensitive)
- Verify ES6 module syntax

**localStorage not persisting**

- Check browser privacy settings
- Verify domain/port consistency
- Look for quota exceeded errors

**File upload not working**

- Check browser console for errors
- Verify file format matches expected structure
- Test with sample files first

### Debug Tools

Add debug logging:

```javascript
// Enable debug mode
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}
```

Use breakpoints in DevTools Sources tab to step through code.

## Performance

### Profiling

Use browser Performance tab to:

- Identify slow operations
- Check rendering performance
- Monitor memory usage

### Optimization Tips

- Minimize DOM manipulation
- Use event delegation
- Cache DOM queries
- Debounce expensive operations

## Security

### Best Practices

- Never use `eval()` or `Function()` constructor
- Sanitize all user input
- Escape HTML entities in user content
- Use Content Security Policy headers
- Keep dependencies updated

### Reviewing Changes

Before submitting PR:

- No hardcoded credentials or API keys
- No XSS vulnerabilities
- No arbitrary code execution
- Proper input validation
