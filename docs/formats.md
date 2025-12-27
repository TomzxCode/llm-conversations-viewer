# Supported Formats

LLM Conversations Viewer supports conversation exports from OpenAI (ChatGPT), Claude (Anthropic), Z.ai, as well as re-importing conversations that were previously exported from this app.
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

## Z.ai Format

### Export Structure

Z.ai exports use a tree-based structure similar to OpenAI:

```json
[
  {
    "id": "conv-uuid-123",
    "user_id": "user-uuid-456",
    "title": "Conversation Title",
    "created_at": 1699564800,
    "updated_at": 1699568400,
    "chat": {
      "title": "Conversation Title",
      "models": ["GLM-4-6-API-V1"],
      "history": {
        "messages": {
          "msg-id-1": {
            "id": "msg-id-1",
            "parentId": null,
            "childrenIds": ["msg-id-2"],
            "role": "user",
            "content": "Hello!",
            "timestamp": 1699564800,
            "models": ["GLM-4-6-API-V1"]
          },
          "msg-id-2": {
            "id": "msg-id-2",
            "parentId": "msg-id-1",
            "childrenIds": [],
            "role": "assistant",
            "content": "Hi there! How can I help?",
            "timestamp": 1699564820,
            "model": "GLM-4-6-API-V1",
            "modelName": "GLM-4.6",
            "done": true,
            "usage": {
              "prompt_tokens": 10,
              "completion_tokens": 15,
              "total_tokens": 25
            }
          }
        },
        "currentId": "msg-id-2"
      }
    }
  }
]
```

### Key Features

- **Conversation Trees**: Similar to OpenAI, uses parent-child relationships for branching
- **Current Path**: The `currentId` field indicates the active conversation path
- **Model Information**: Includes model name and usage statistics
- **Unix Timestamps**: Timestamps in seconds since epoch
- **Rich Metadata**: Supports model usage data, completion status, and more

### Processing

The parser:

1. Follows the `currentId` path backwards to the root
2. Extracts messages from the message object map
3. Preserves model, usage, and status information in metadata
4. Converts Unix timestamps to JavaScript Date objects

## Normalized Format (Internal & Export)

All formats (OpenAI, Claude, and Z.ai) are converted to a common internal structure. This is also the format used when exporting conversations from this app.

### Internal Structure (with Date objects)

```javascript
{
  id: string,              // Unique conversation identifier
  title: string,           // Conversation title
  created: Date,           // Creation timestamp (Date object)
  updated: Date,           // Last update timestamp (Date object)
  format: 'openai' | 'claude' | 'zai',  // Source format
  summary?: string,        // Optional conversation summary (Claude only)
  messages: [
    {
      id: string,          // Unique message identifier
      role: 'user' | 'assistant' | 'system',  // Message role
      content: string,     // Message text content
      timestamp: Date,     // Message timestamp (Date object)
      metadata: {
        model?: string,    // Model used (OpenAI, Z.ai)
        models?: string[], // Available models (Z.ai)
        attachments?: [],  // Attachments (Claude only)
        files?: [],        // File metadata (Claude only)
        status?: string,   // Message status (OpenAI, Z.ai)
        done?: boolean,    // Completion status (Z.ai)
        usage?: object     // Token usage stats (Z.ai)
        // ... other format-specific data
      }
    }
  ]
}
```

### Export Format (JSON serialized)

When exported, Date objects are converted to ISO 8601 strings:

```json
{
  "id": "conv-abc123",
  "title": "Conversation Title",
  "created": "2024-01-15T10:30:00.000Z",
  "updated": "2024-01-15T11:45:00.000Z",
  "format": "openai",
  "summary": null,
  "messages": [
    {
      "id": "msg-123",
      "role": "user",
      "content": "Hello!",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "metadata": {}
    },
    {
      "id": "msg-124",
      "role": "assistant",
      "content": "Hi there! How can I help?",
      "timestamp": "2024-01-15T10:30:15.000Z",
      "metadata": {
        "model": "gpt-4"
      }
    }
  ]
}
```

### Re-importing Exported Conversations

Conversations exported from this app can be seamlessly re-imported:

1. The format is automatically detected as `'normalized'`
2. ISO 8601 timestamp strings are converted back to Date objects
3. All metadata is preserved exactly as it was
4. The original source format (`openai`, `claude`, or `zai`) is maintained

This allows for:
- Backing up conversations
- Sharing conversations with others
- Moving conversations between browsers
- Archiving conversations outside of IndexedDB

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

1. **Normalized Detection**: Checks for `id`, `messages`, `format`, `created`, and `updated` fields
2. **OpenAI Detection**: Checks for `mapping` and `current_node` fields
3. **Claude Detection**: Checks for `chat_messages` and `uuid` fields
4. **Z.ai Detection**: Checks for `chat.history.messages` and `chat.history.currentId` fields
5. **Fallback**: Shows error if format is unrecognized

Detection is performed in this order to ensure exported conversations are correctly identified before checking for original formats.

## Validation

The parser validates:

- Required fields are present
- Timestamp formats are valid
- Message structure is correct
- Node references are valid (OpenAI only)

Invalid or corrupted files will show an error message.
