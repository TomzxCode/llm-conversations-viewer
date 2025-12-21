# LLM Conversations Viewer

A client-side web application for viewing and browsing exported conversations from ChatGPT (OpenAI) and Claude (Anthropic).
All processing happens locally in your browser - no data is sent to any server.

## Features

- **Multi-format Support**: Automatically detects and parses both OpenAI and Claude conversation exports
- **Drag & Drop Interface**: Simply drag and drop your export files (.json or .zip)
- **URL Import**: Load conversations directly from a URL without persisting them locally
- **Search & Filter**: Real-time search across conversation titles and message content with keyword highlighting
- **Persistent Storage**: Conversations are saved in browser localStorage for future sessions
- **Markdown Rendering**: Messages are rendered with proper markdown formatting
- **Syntax Highlighting**: Code blocks are highlighted using highlight.js
- **Clean UI**: Bootstrap-based responsive interface with sidebar navigation

## Usage

### Quick Start

1. Open [index.html](index.html) in a modern web browser
2. Load your conversation export file:
   - **Upload**: Click the upload button in the sidebar
   - **Drag & Drop**: Drag and drop a .json or .zip file onto the page
   - **URL Import**: Enter a URL in the input field or use `?url=https://example.com/conversations.json`
3. **Search** (optional): Use the search box to filter conversations by keywords
4. Select a conversation from the sidebar to view

> **Note**: Conversations loaded from URLs are not persisted to localStorage and will be cleared on page refresh.

### Supported Export Formats

**OpenAI (ChatGPT)**
- Export format: `conversations.json` from ChatGPT data export
- Supports conversation trees (uses current_node path)
- Preserves model information and message metadata

**Claude**
- Export format: Claude conversation JSON export
- Linear conversation history
- Includes attachments and files metadata

### File Formats

- `.json` - Direct conversation export file
- `.zip` - Archive containing `conversations.json`

## Architecture

### Core Components

- **[js/app.js](js/app.js)** - Main application and state management
- **[js/parsers.js](js/parsers.js)** - Format detection and conversation parsing
- **[js/utils/file-handler.js](js/utils/file-handler.js)** - File upload and drag-drop handling
- **[js/utils/storage.js](js/utils/storage.js)** - localStorage persistence
- **[js/ui/sidebar.js](js/ui/sidebar.js)** - Conversation list UI
- **[js/ui/chat-view.js](js/ui/chat-view.js)** - Message rendering
- **[js/ui/markdown.js](js/ui/markdown.js)** - Markdown processing with code highlighting

### Data Flow

1. File uploaded → [file-handler.js](js/utils/file-handler.js) processes it
2. JSON parsed → [parsers.js](js/parsers.js) detects format and normalizes data
3. Conversations stored → [storage.js](js/utils/storage.js) saves to localStorage
4. UI updated → Sidebar and chat view render conversations

### Normalized Format

Both OpenAI and Claude formats are converted to a common structure:

```javascript
{
  id: string,
  title: string,
  created: Date,
  updated: Date,
  format: 'openai' | 'claude',
  messages: [
    {
      id: string,
      role: 'user' | 'assistant' | 'system',
      content: string,
      timestamp: Date,
      metadata: object
    }
  ]
}
```

## Technologies

- **Bootstrap 5.3** - UI framework
- **Marked.js** - Markdown parsing
- **Highlight.js** - Syntax highlighting for code blocks
- **JSZip** - ZIP file handling
- **Vanilla JavaScript (ES6 modules)** - No build tools required

## Privacy

All data processing happens entirely in your browser.
No conversations or data are sent to any external servers.
Conversations are stored locally in your browser's localStorage.

## Development

No build step required - just serve the files with any static web server.
`index.html` cannot be directly opened due to module import restrictions - use a local server.

## License

MIT
