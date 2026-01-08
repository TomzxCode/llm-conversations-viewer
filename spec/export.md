# Export Specification

## Overview
This specification defines the requirements for exporting conversations from the LLM Conversations Viewer in the normalized JSON format.

## Requirements

### Export Format
- Exported conversations MUST use the normalized JSON format
- The exported format MUST be re-importable without data loss
- The exported format MUST preserve the source platform format identifier
- Date objects MUST be serialized to ISO 8601 strings
- All conversation metadata MUST be preserved
- All message metadata MUST be preserved

### Supported Export Operations
- The system MUST support exporting a single conversation
- The system MUST support exporting multiple selected conversations
- The system MUST support exporting all conversations

### Export Data Structure
Each exported conversation MUST have the following structure:

```javascript
{
  id: string,              // Unique conversation identifier
  title: string,           // Conversation title
  created: string,         // ISO 8601 date string
  updated: string,         // ISO 8601 date string
  format: string,          // 'openai' | 'claude' | 'zai'
  summary: string,         // Optional conversation summary
  messages: [
    {
      id: string,          // Unique message identifier
      role: string,        // 'user' | 'assistant' | 'system'
      content: string,     // Message text content
      timestamp: string,   // ISO 8601 date string
      metadata: object     // Platform-specific metadata
    }
  ]
}
```

### Date Serialization
- Date objects MUST be converted to ISO 8601 strings using `toISOString()`
- ISO strings MUST preserve timezone information
- ISO strings MUST be parseable by `Date` constructor on re-import

### Filename Generation
- Single conversation export MUST use the conversation title as the filename
- Multiple conversation export MUST use a timestamp-based filename
- Filenames MUST be sanitized to remove invalid characters
- Invalid characters MUST be replaced with hyphens
- Multiple hyphens MUST be collapsed to single hyphens
- Leading/trailing hyphens MUST be removed
- Filenames MUST be limited to 50 characters for titles
- Timestamp-based filenames MUST use format: `conversations-YYYY-MM-DD-HHMMSS.json`
- All filenames MUST use lowercase
- All filenames MUST end with `.json` extension

### File Download
- The system MUST trigger a browser download of the exported file
- The system MUST create a Blob with MIME type `application/json`
- The system MUST create a temporary object URL for the download
- The system MUST revoke the object URL after initiating download
- JSON MUST be formatted with 2-space indentation for readability

### Export Triggering
- Export current button MUST export the currently selected conversation
- Export selected button MUST export all selected conversations
- Export all button MUST export all loaded conversations
- Each export button MUST generate an appropriate filename
- Export operations MUST not modify the application state

### Export Validation
- The exported JSON MUST be valid JSON
- The exported JSON MUST be parseable by the application's import function
- The exported JSON MUST preserve all data from the original conversation
- Date strings MUST be properly formatted
- All required fields MUST be present in exported data

### Error Handling
- The system MUST handle export failures gracefully
- The system SHOULD notify the user of successful exports
- The system MUST log export errors to console
- The system MUST not throw uncaught exceptions during export

### Data Integrity
- All conversation fields MUST be included in export
- All message fields MUST be included in export
- Platform-specific metadata MUST be preserved
- Message order MUST be preserved
- Conversation metadata MUST be preserved

### Export API
- The system MUST provide an `exportConversations` function
- The function MUST accept a conversation or array of conversations
- The function MUST accept an optional filename parameter
- The function MUST default to `conversations.json` if no filename provided
- The system MUST provide a `generateFilename` function
- The filename function MUST accept a conversation or array of conversations
- The filename function MUST return an appropriate filename string

### Re-import Compatibility
- Exported conversations MUST be re-importable into the application
- Re-imported conversations MUST retain all original data
- Re-imported conversations MUST retain the correct format identifier
- Re-imported conversations MUST have proper Date objects after import
- The system MUST treat re-imported conversations as normalized format

### Large Export Handling
- The system MUST handle exporting large conversation sets
- The system MUST handle exporting conversations with large message content
- JSON generation MUST not block the UI for typical export sizes
- The system SHOULD consider pagination for extremely large exports (future enhancement)

### User Feedback
- The system MUST log the number of conversations exported to console
- The system MAY show a success message after export completion
- The system MAY show the exported filename in the success message
