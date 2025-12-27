# LLM Conversations Viewer

A client-side web application for viewing and browsing exported conversations from ChatGPT (OpenAI), Claude (Anthropic), and Z.ai.
All processing happens locally in your browser - no data is sent to any server.

## Features

- **Multi-format Support**: Automatically detects and parses OpenAI, Claude, and Z.ai conversation exports
- **Drag & Drop Interface**: Simply drag and drop your export files (.json or .zip)
- **URL Import**: Load conversations directly from a URL without persisting them locally
- **Persistent Storage**: Conversations are saved in browser IndexedDB for future sessions (100MB+ capacity)
- **Markdown Rendering**: Messages are rendered with proper markdown formatting
- **Syntax Highlighting**: Code blocks are highlighted using highlight.js
- **Clean UI**: Bootstrap-based responsive interface with sidebar navigation

## Privacy First

All data processing happens entirely in your browser.
No conversations or data are sent to any external servers.
Conversations are stored locally in your browser's IndexedDB, providing ample storage space for large conversation histories.

## Quick Start

See [Getting Started](getting-started.md) for detailed instructions.

## Supported Formats

**OpenAI (ChatGPT)**

- Export format: `conversations.json` from ChatGPT data export
- Supports conversation trees (uses current_node path)
- Preserves model information and message metadata

**Claude (Anthropic)**

- Export format: Claude conversation JSON export
- Linear conversation history
- Includes attachments and files metadata

**Z.ai**

- Export format: Z.ai conversation JSON export
- Supports conversation trees (uses currentId path)
- Preserves model information, usage statistics, and metadata

## Technologies

- Bootstrap 5.3 - UI framework
- Marked.js - Markdown parsing
- Highlight.js - Syntax highlighting for code blocks
- JSZip - ZIP file handling
- Vanilla JavaScript (ES6 modules) - No build tools required

## License

MIT
