# Storage Specification

## Overview
This specification defines the requirements for persisting and retrieving conversation data in the LLM Conversations Viewer application using IndexedDB for large-scale storage.

## Requirements

### Storage Backend
- The system MUST use IndexedDB as the primary storage backend
- The system MUST provide much larger storage capacity than localStorage (typically 100MB+)
- The system MUST fall back to localStorage for reading legacy data (migration only)
- The system SHOULD check for IndexedDB availability before use

### Database Schema
- The database MUST be named `llm-conversations-db`
- The database version MUST be `1`
- The object store MUST be named `conversations`
- The object store MUST use `id` as the key path
- The object store MUST create an index on `created` field
- The object store MUST create an index on `updated` field
- The object store MUST create an index on `title` field

### Conversation Persistence
- The system MUST save all conversations when `saveConversations` is called
- The system MUST replace all existing conversations when saving (not merge)
- The system MUST store Date objects as ISO strings in IndexedDB
- The system MUST return `true` on successful save
- The system MUST return `false` on save failure
- The system MUST log errors to console on save failure

### Conversation Retrieval
- The system MUST load all conversations when `loadConversations` is called
- The system MUST convert ISO strings back to Date objects when loading
- The system MUST return an empty array if no conversations exist
- The system MUST return an empty array on load failure
- The system MUST log errors to console on load failure

### Data Migration
- The system MUST attempt to load conversations from localStorage if IndexedDB is empty
- The system MUST convert legacy localStorage data to the current format
- The system MUST save migrated conversations to IndexedDB
- The system MUST clear localStorage after successful migration
- The system MUST log migration status to console
- The system MUST handle corrupted localStorage data gracefully

### Data Clearing
- The system MUST provide a method to clear all conversations from IndexedDB
- The system MUST also clear localStorage when clearing data (for cleanup)
- The system MUST handle clearing errors gracefully

### Storage API
- The system MUST provide a static `Storage` class with the following methods:
  - `saveConversations(conversations: Array): Promise<boolean>`
  - `loadConversations(): Promise<Array>`
  - `clearConversations(): Promise<void>`
  - `isAvailable(): boolean`
  - `getStorageSize(): Promise<number>`

### Storage Size Calculation
- The system MUST provide a method to calculate approximate storage size
- Size calculation MUST be based on JSON stringified data
- Size MUST be returned in bytes
- The system MUST return `0` on calculation error

### Error Handling
- The system MUST handle IndexedDB initialization errors
- The system MUST handle transaction errors
- The system MUST handle transaction aborts
- The system MUST handle request errors
- The system MUST catch and log all errors
- The system MUST not throw uncaught exceptions to the application layer

### Database Initialization
- The system MUST initialize the database on first use
- The system MUST create the object store if it doesn't exist
- The system MUST use a Promise-based initialization
- The system MUST cache the initialization promise to prevent multiple inits
- The system MUST handle database upgrade events

### Promise Wrapping
- The system MUST wrap IndexedDB requests in Promises
- The system MUST resolve Promises on request success
- The system MUST reject Promises on request error
- The system MUST provide a helper method for promisifying requests

### Date Handling
- Date objects MUST be serialized to ISO strings before storage
- Date objects MUST be deserialized from ISO strings after retrieval
- Date serialization MUST preserve timezone information
- Conversation `created` field MUST be a Date object in memory
- Conversation `updated` field MUST be a Date object in memory
- Message `timestamp` field MUST be a Date object in memory

### Browser Compatibility
- The system MUST work in all modern browsers that support IndexedDB
- The system SHOULD degrade gracefully if IndexedDB is not available
- The system MUST detect IndexedDB availability via `window.indexedDB`
