# Supported Formats

LLM Conversations Viewer supports conversation exports from both OpenAI (ChatGPT) and Claude (Anthropic).
This page details the expected format for each provider and how they are normalized internally.

## OpenAI (ChatGPT) Format

### Export Structure

ChatGPT exports use a `conversations.json` file with the following structure:

```json
[
  {
    "id": "conv-abc123",
    "title": "Conversation Title",
    "create_time": 1699564800.0,
    "update_time": 1699568400.0,
    "mapping": {
      "node-id-1": {
        "id": "node-id-1",
        "message": {
          "id": "msg-id-1",
          "author": {
            "role": "user"
          },
          "create_time": 1699564800.0,
          "content": {
            "content_type": "text",
            "parts": ["Hello!"]
          }
        },
        "parent": null,
        "children": ["node-id-2"]
      },
      "node-id-2": {
        "id": "node-id-2",
        "message": {
          "id": "msg-id-2",
          "author": {
            "role": "assistant"
          },
          "create_time": 1699564820.0,
          "content": {
            "content_type": "text",
            "parts": ["Hi there! How can I help?"]
          },
          "metadata": {
            "model_slug": "gpt-4"
          }
        },
        "parent": "node-id-1",
        "children": []
      }
    },
    "current_node": "node-id-2"
  }
]
```

### Key Features

- **Conversation Trees**: OpenAI exports include branching conversations using a node structure
- **Current Path**: The `current_node` field indicates which branch was active
- **Model Information**: Each message includes the model used (`gpt-3.5-turbo`, `gpt-4`, etc.)
- **Timestamps**: Unix timestamps for creation and update times

### Processing

The parser:

1. Follows the `current_node` path to reconstruct the linear conversation
2. Extracts messages from the node tree
3. Preserves model information in message metadata
4. Converts Unix timestamps to JavaScript Date objects

## Claude Format

### Export Structure

Claude exports use a simpler JSON structure:

```json
{
  "uuid": "conv-uuid-123",
  "name": "Conversation Title",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T11:45:00.000Z",
  "chat_messages": [
    {
      "uuid": "msg-uuid-1",
      "text": "Hello!",
      "sender": "human",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "uuid": "msg-uuid-2",
      "text": "Hi there! How can I help?",
      "sender": "assistant",
      "created_at": "2024-01-15T10:30:15.000Z"
    }
  ]
}
```

### Key Features

- **Linear Conversations**: Simple chronological message list
- **Attachments**: Support for file attachments and metadata
- **ISO Timestamps**: Standard ISO 8601 timestamp format
- **Sender Roles**: Uses "human" and "assistant" (normalized to "user" and "assistant")

### Processing

The parser:

1. Extracts messages from `chat_messages` array
2. Maps "human" sender to "user" role for consistency
3. Converts ISO timestamps to JavaScript Date objects
4. Preserves attachment metadata

## Normalized Format

Both formats are converted to a common internal structure:

```javascript
{
  id: string,              // Unique conversation identifier
  title: string,           // Conversation title
  created: Date,           // Creation timestamp
  updated: Date,           // Last update timestamp
  format: 'openai' | 'claude',  // Source format
  messages: [
    {
      id: string,          // Unique message identifier
      role: 'user' | 'assistant' | 'system',  // Message role
      content: string,     // Message text content
      timestamp: Date,     // Message timestamp
      metadata: {
        model?: string,    // Model used (OpenAI only)
        attachments?: [],  // Attachments (Claude only)
        // ... other format-specific data
      }
    }
  ]
}
```

## File Formats

### JSON Files

Direct JSON exports can be uploaded:

- `conversations.json` - OpenAI export
- `*.json` - Claude single conversation export

### ZIP Files

The viewer can extract and process ZIP archives containing:

- `conversations.json` in the root or any subdirectory
- Automatically detects the format after extraction

## Format Detection

The app automatically detects the format by examining the JSON structure:

1. **OpenAI Detection**: Checks for `mapping` and `current_node` fields
2. **Claude Detection**: Checks for `chat_messages` array
3. **Fallback**: Shows error if format is unrecognized

## Validation

The parser validates:

- Required fields are present
- Timestamp formats are valid
- Message structure is correct
- Node references are valid (OpenAI only)

Invalid or corrupted files will show an error message.
