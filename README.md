# LLM Conversations Viewer

A client-side web application for viewing and browsing exported conversations from ChatGPT (OpenAI), Claude (Anthropic), and Z.ai.
All processing happens locally in your browser - no data is sent to any server.

## Features

- **Multi-format Support**: Automatically detects and parses OpenAI, Claude, and Z.ai conversation exports
- **Drag & Drop Interface**: Simply drag and drop your export files (.json or .zip)
- **URL Import**: Load conversations directly from a URL without persisting them locally
- **Continue Conversation**: One-click link to continue any conversation on its original platform (ChatGPT, Claude, or Z.ai)
- **Export Functionality**: Export single, selected, or all conversations in normalized JSON format
- **Search & Filter**: Real-time search across conversation titles and message content with keyword highlighting
- **Persistent Storage**: Conversations are saved in browser IndexedDB for future sessions (100MB+ capacity)
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
5. **Continue Conversation** (optional): Click the "Continue conversation" button in the chat header to open the conversation on its original platform
6. **Export** (optional):
   - **Export Single**: Click the "Export" button in the chat header to export the current conversation
   - **Export Selected**: Check the boxes next to conversations in the sidebar, then click the blue export button
   - **Export All**: Click the green download button in the sidebar to export all conversations
   - **Select All/None**: Use the "All" and "None" buttons in the sidebar to quickly select or deselect conversations

> **Note**: Conversations loaded from URLs are not persisted to IndexedDB and will be cleared on page refresh.

### Supported Import Formats

**OpenAI (ChatGPT)**
- Export format: `conversations.json` from ChatGPT data export
- Supports conversation trees (uses current_node path)
- Preserves model information and message metadata

**Claude**
- Export format: Claude conversation JSON export
- Linear conversation history
- Includes attachments and files metadata

**Z.ai**
- Export format: Z.ai conversation JSON export
- Supports conversation trees (uses currentId path)
- Preserves model information, usage statistics, and metadata

**Normalized (Re-import)**
- Conversations exported from this app can be re-imported
- Uses a standardized format that preserves all data

### File Formats

- `.json` - Direct conversation export file
- `.zip` - Archive containing `conversations.json`

### Export Format

Exported conversations use a normalized JSON format that can be re-imported into the viewer:

```javascript
[
  {
    "id": "unique-id",
    "title": "Conversation Title",
    "created": "2024-01-15T10:30:00.000Z",
    "updated": "2024-01-15T11:45:00.000Z",
    "format": "openai" | "claude" | "zai",
    "summary": "Optional conversation summary",
    "messages": [
      {
        "id": "message-id",
        "role": "user" | "assistant" | "system",
        "content": "Message text",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "metadata": {
          "model": "Model name",
          "usage": { /* Z.ai token usage stats */ }
        }
      }
    ]
  }
]
```

This format preserves the original conversation source (`format` field) and all metadata.

## Architecture

### Core Components

- **[js/app.js](js/app.js)** - Main application and state management
- **[js/parsers.js](js/parsers.js)** - Format detection and conversation parsing
- **[js/utils/file-handler.js](js/utils/file-handler.js)** - File upload and drag-drop handling
- **[js/utils/storage.js](js/utils/storage.js)** - Storage persistence wrapper
- **[js/utils/indexeddb.js](js/utils/indexeddb.js)** - IndexedDB implementation with large storage capacity
- **[js/utils/export.js](js/utils/export.js)** - Conversation export functionality
- **[js/utils/platform-urls.js](js/utils/platform-urls.js)** - Platform URL generation for continuing conversations
- **[js/ui/sidebar.js](js/ui/sidebar.js)** - Conversation list UI
- **[js/ui/chat-view.js](js/ui/chat-view.js)** - Message rendering
- **[js/ui/markdown.js](js/ui/markdown.js)** - Markdown processing with code highlighting

### Data Flow

1. File uploaded → [file-handler.js](js/utils/file-handler.js) processes it
2. JSON parsed → [parsers.js](js/parsers.js) detects format and normalizes data
3. Conversations stored → [storage.js](js/utils/storage.js) saves to IndexedDB
4. UI updated → Sidebar and chat view render conversations

### Normalized Format

All formats (OpenAI, Claude, and Z.ai) are converted to a common structure:

```javascript
{
  id: string,
  title: string,
  created: Date,
  updated: Date,
  format: 'openai' | 'claude' | 'zai',
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
Conversations are stored locally in your browser's IndexedDB, providing ample storage space for large conversation histories.

## Development

No build step required - just serve the files with any static web server.
`index.html` cannot be directly opened due to module import restrictions - use a local server.

## License

MIT
