# Conversation Parsing Specification

## Overview
This specification defines the requirements for parsing and normalizing conversation exports from multiple LLM platforms (OpenAI/ChatGPT, Claude/Anthropic, and Z.ai) into a unified format for viewing in the LLM Conversations Viewer application.

## Requirements

### Format Detection
- The system MUST automatically detect the format of imported conversation data (OpenAI, Claude, Z.ai, or normalized)
- The system MUST validate that imported data is a non-empty array
- The system MUST throw a descriptive error when encountering an unknown format
- Format detection MUST be based on the presence of required structural keys in the first conversation object

### OpenAI Format Parsing
- The parser MUST handle the OpenAI export format with `mapping` and `current_node` fields
- The parser MUST walk the conversation tree from `current_node` backwards via `parent` references
- The parser MUST preserve message order from root to current node
- The parser MUST exclude messages where `is_visually_hidden_from_conversation` is true
- The parser MUST exclude messages without content
- The parser MUST extract message content from `content.parts` array, joining with newlines
- The parser MUST preserve the following metadata:
  - Message ID
  - Author role (user/assistant/system)
  - Timestamp (converted from Unix timestamp)
  - Model slug from metadata
  - Message status
- The parser MUST extract conversation title, creation time, and update time
- The parser MUST use `conversation_id` or `id` as the conversation identifier

### Claude Format Parsing
- The parser MUST handle the Claude export format with `chat_messages` and `uuid` fields
- The parser MUST process messages in linear order from the `chat_messages` array
- The parser MUST map sender type: `human` to `user`, others to `assistant`
- The parser MUST extract text content from content blocks of type `text`
- The parser MUST join multiple text content blocks with newlines
- The parser MUST preserve the following metadata:
  - Message UUID
  - Sender role
  - Text content
  - Timestamp
  - Attachments metadata
  - Files metadata
- The parser MUST preserve conversation summary if present
- The parser MUST use `uuid` as the conversation identifier

### Z.ai Format Parsing
- The parser MUST handle the Z.ai export format with `chat.history.messages` and `chat.history.currentId`
- The parser MUST walk the conversation tree from `currentId` backwards via `parentId` references
- The parser MUST preserve message order from root to current node
- The parser MUST extract content directly from message nodes
- The parser MUST preserve the following metadata:
  - Message ID
  - Role (user/assistant/system)
  - Content text
  - Timestamp (converted from Unix timestamp)
  - Model information
  - Done status
  - Usage statistics
- The parser MUST extract conversation title from `title` or `chat.title`
- The parser MUST use `id` as the conversation identifier

### Normalized Format Parsing
- The parser MUST handle the normalized format exported by this application
- The parser MUST convert ISO date strings back to Date objects
- The parser MUST preserve all conversation metadata including format type
- The parser MUST preserve message-level metadata
- This format MUST be fully re-importable without data loss

### Normalized Structure
All parsers MUST produce a normalized conversation object with the following structure:

```javascript
{
  id: string,              // Unique conversation identifier
  title: string,           // Conversation title
  created: Date,           // Creation timestamp
  updated: Date,           // Last update timestamp
  format: string,          // Source format: 'openai' | 'claude' | 'zai'
  summary: string,         // Optional conversation summary
  messages: [
    {
      id: string,          // Unique message identifier
      role: string,        // 'user' | 'assistant' | 'system'
      content: string,     // Message text content
      timestamp: Date,     // Message timestamp
      metadata: object     // Platform-specific metadata
    }
  ]
}
```

### Error Handling
- The parser MUST throw descriptive errors for invalid data formats
- The parser MUST handle missing optional fields gracefully
- The parser MUST provide meaningful error messages for malformed data
- The parser SHOULD validate data structure before processing

### Extensibility
- The parsing architecture MUST support adding new format parsers
- New format parsers MUST implement the same normalized output structure
- Format detection MUST be extensible without modifying existing parsers
