# File Import Specification

## Overview
This specification defines the requirements for importing conversation data from files and URLs into the LLM Conversations Viewer application.

## Requirements

### Supported File Formats
- The system MUST accept `.json` files containing conversation data
- The system MUST accept `.zip` files containing a `conversations.json` file
- The system MUST reject unsupported file types with a clear error message
- The system SHOULD attempt to auto-detect file type from URL when loading from remote sources

### File Upload Methods

#### Drag and Drop
- The system MUST support dragging and dropping files onto the page
- The system MUST show a visual overlay when files are dragged over the document
- The overlay MUST be hidden when the file is dropped or the drag leaves the document
- The system MUST handle the first file when multiple files are dropped
- The system MUST prevent default browser behavior for drag events

#### File Input
- The system MUST provide a file input triggered by a button click
- The system MUST reset the file input after processing to allow re-selection of the same file
- The system MUST process the selected file when the input changes

#### URL Import
- The system MUST provide a text input for entering URLs
- The system MUST trigger URL load when the user clicks the load button
- The system MUST trigger URL load when the user presses Enter in the URL input
- The system MUST accept URLs via query parameter: `?url=https://example.com/conversations.json`
- The system SHOULD load conversations from URL automatically when the query parameter is present
- The system MUST determine file type from Content-Type header or URL extension
- The system MUST attempt to parse as JSON if content type cannot be determined
- The system MUST handle network errors gracefully

### ZIP File Processing
- The system MUST use JSZip library to extract ZIP archives
- The system MUST look for `conversations.json` in the ZIP archive
- The system MUST throw an error if `conversations.json` is not found in the ZIP
- The system MUST process the extracted JSON file

### JSON File Processing
- The system MUST parse the JSON text
- The system MUST pass parsed data to the conversation parser
- The system MUST emit a custom event `conversations-loaded` with parsed conversations
- The event MUST include the source filename
- The event MUST include a `fromUrl` flag for URL-loaded conversations

### User Feedback
- The system MUST display success messages with the number of conversations loaded
- The system MUST display error messages for processing failures
- Messages MUST be displayed as toast notifications
- Toast notifications MUST auto-hide after 5 seconds
- Toast notifications MUST be dismissible by user
- The system MUST use Bootstrap toast component for notifications

### Integration with Application State
- For file uploads: The system MUST persist conversations to storage
- For URL imports: The system MUST NOT persist conversations to storage
- For file uploads: The system MUST merge new conversations with existing ones
- For URL imports: The system MUST replace all conversations
- The system MUST avoid adding duplicate conversations by ID

### Error Handling
- The system MUST catch and display errors from JSON parsing
- The system MUST catch and display errors from ZIP extraction
- The system MUST catch and display errors from network requests
- The system MUST catch and display errors from conversation parsing
- Error messages MUST be user-friendly and descriptive
- The system MUST log detailed errors to console for debugging

### Security
- The system MUST escape user-provided content before displaying in UI
- The system MUST validate JSON structure before parsing
- The system MUST handle malformed JSON gracefully
- The system SHOULD sanitize URLs before making requests

### Performance
- The system MUST process large files without blocking the UI
- The system MUST handle ZIP files asynchronously
- The system MUST handle network requests asynchronously
- The system SHOULD provide loading indicators for long-running operations
