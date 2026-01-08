# State Management Specification

## Overview
This specification defines the requirements for managing application state in the LLM Conversations Viewer, including conversation data, selection state, and event handling.

## Requirements

### Application State
- The application MUST maintain a centralized state object
- The state MUST contain the list of all loaded conversations
- The state MUST track the currently selected conversation ID
- The state MUST support event-driven updates

### State Structure
The application state MUST include:
- `conversations`: Array of conversation objects
- `currentConversationId`: String ID of the selected conversation or null
- `listeners`: Object mapping event names to callback arrays

### Conversation Management
- The state MUST support adding new conversations
- The state MUST support replacing all conversations
- The state MUST merge new conversations avoiding duplicates by ID
- The state MUST maintain conversation order
- Adding conversations MUST return the count of new conversations added

### Conversation Selection
- The state MUST support selecting a conversation by ID
- Selecting a conversation MUST update `currentConversationId`
- Selecting a conversation MUST emit a `conversation-selected` event
- The state MUST provide a method to get the current conversation object

### Conversation Retrieval
- The state MUST provide a method to get all conversations
- The state MUST provide a method to get the current conversation
- The state MUST return null if no conversation is selected
- The state MUST return an empty array if no conversations are loaded

### Persistence Control
- The state MUST support adding conversations with or without persistence
- When `persist` is true, conversations MUST be saved to storage
- When `persist` is false, conversations MUST NOT be saved to storage
- URL imports MUST use non-persistent mode
- File uploads MUST use persistent mode

### Event System
- The state MUST implement a publish-subscribe event system
- The state MUST support registering event listeners
- The state MUST support emitting events with data
- The state MUST support multiple listeners per event
- Event listeners MUST be called in registration order

### Event Types
- `conversations-updated`: Emitted when the conversation list changes
  - MUST pass the updated conversations array to listeners
- `conversation-selected`: Emitted when a conversation is selected
  - MUST pass the selected conversation object to listeners

### Event Listener Management
- The state MUST support registering listeners via `on(event, callback)`
- The state MUST support emitting events via `emit(event, data)`
- Listeners MUST receive the event data as a parameter
- The state MUST initialize empty listener arrays for new events

### Application Lifecycle
- The application MUST initialize state on startup
- The application MUST load saved conversations from storage on startup
- The application MUST check for URL parameters on startup
- The application MUST auto-load from URL if `?url=` parameter is present
- The application MUST auto-select the first conversation if none is selected

### Integration with Storage
- The state MUST integrate with the Storage module
- The state MUST save conversations to storage when `persist` is true
- The state MUST NOT save conversations to storage when `persist` is false
- The state MUST load conversations from storage on initialization
- The state MUST handle storage failures gracefully

### Integration with UI Components
- The state MUST notify the sidebar when conversations are updated
- The state MUST notify the chat view when a conversation is selected
- The state MUST pass search queries to the chat view for highlighting
- The state MUST show/hide UI elements based on state changes

### Duplicate Prevention
- The state MUST track existing conversation IDs
- The state MUST filter out conversations with duplicate IDs when adding
- The state MUST only count truly new conversations in the return value
- The state MUST log when all conversations from a file were duplicates

### Error Handling
- The state MUST handle invalid conversation IDs gracefully
- The state MUST return null for invalid conversation selections
- The state MUST not throw exceptions for missing events
- The state MUST not throw exceptions for missing listeners

### Initialization
- The state MUST start with an empty conversations array
- The state MUST start with null as the current conversation ID
- The state MUST start with an empty listeners object
- The state MUST be fully initialized before any UI operations

### State Updates
- All state updates MUST emit appropriate events
- State updates MUST be atomic for conversation operations
- State updates MUST maintain data consistency
- State updates MUST not leave the application in an invalid state

### Memory Management
- The state MUST not leak memory through event listeners
- The state SHOULD provide a mechanism to remove listeners (optional)
- The state MUST handle large conversation sets efficiently
- The state MUST not create unnecessary object copies

### Thread Safety
- Since JavaScript is single-threaded, the state MUST handle async operations properly
- The state MUST await storage operations before emitting events
- The state MUST not allow concurrent state modifications
