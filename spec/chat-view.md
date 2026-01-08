# Chat View Specification

## Overview
This specification defines the requirements for the chat view component that displays conversation messages in the LLM Conversations Viewer.

## Requirements

### Conversation Display
- The chat view MUST display all messages in the selected conversation
- Messages MUST be displayed in chronological order
- Messages MUST be grouped by role (user/assistant)
- Each message MUST have a timestamp
- The chat view MUST scroll to the bottom when rendering a new conversation

### Message Rendering
- User messages MUST be visually distinct from assistant messages
- Each message MUST have a wrapper element with appropriate role class
- Each message MUST have a bubble element with appropriate role class
- Message content MUST be rendered as markdown
- Timestamps MUST be displayed below each message
- Timestamps MUST use HH:MM format

### Empty State
- The chat view MUST display an empty state when no conversation is selected
- The empty state MUST display a welcome icon
- The empty state MUST display "Select a conversation" heading
- The empty state MUST display instructions
- The empty state MUST hide the continue conversation button

### Conversation Header
- The header MUST display the conversation title
- The header MUST display a format badge
- The header MUST display the update date
- The header MUST display the message count
- Header elements MUST be separated by bullets

### Markdown Rendering
- Message content MUST be parsed as GitHub Flavored Markdown
- Line breaks MUST be converted to `<br>` tags
- Code blocks MUST be syntax-highlighted using highlight.js
- Code blocks MUST support language-specific highlighting
- Code blocks MUST fall back to auto-detection if language is not specified
- The system MUST handle markdown parsing errors gracefully
- On markdown error, the system MUST fall back to plain text with line breaks

### Search Highlighting
- Search terms MUST be highlighted in message content when a search query is active
- Search terms MUST be highlighted in text nodes only
- Highlighting MUST NOT occur inside `<code>` or `<pre>` tags
- Highlighting MUST use `<mark>` tags with `search-highlight` class
- Highlighting MUST preserve original text casing
- Special regex characters in search terms MUST be escaped
- Search highlighting MUST use TreeWalker for efficient text node traversal

### Continue Conversation Button
- The button MUST be displayed when a platform URL is available
- The button MUST be hidden when no platform URL is available
- The button MUST link to the correct platform URL
- The button MUST display as an inline-block element
- The button href MUST be updated when a new conversation is selected

### Format Badges
- OpenAI conversations MUST display a green "OpenAI" badge
- Claude conversations MUST display a blue "Claude" badge
- Z.ai conversations MUST display a light blue "Z.ai" badge
- Unknown formats MUST display a gray "Unknown" badge

### Date Formatting
- Conversations updated today MUST display "Today"
- Conversations updated yesterday MUST display "Yesterday"
- Conversations updated less than a week ago MUST display "X days ago"
- Older conversations MUST display the full date

### XSS Prevention
- All message content MUST be HTML-escaped before rendering
- Markdown rendering MUST NOT introduce XSS vulnerabilities
- The chat view MUST use a dedicated escape function for HTML content
- User-generated content MUST be sanitized before display

### Message Metadata
- The chat view MUST extract and display message timestamps
- The chat view SHOULD support displaying additional metadata in the future
- Message metadata MUST be available in the conversation object

### Platform Integration
- The chat view MUST generate platform URLs for continuing conversations
- Platform URLs MUST be generated based on conversation format and ID
- The chat view MUST use the platform-urls utility for URL generation

### Rendering Performance
- The chat view MUST handle conversations with many messages efficiently
- The chat view SHOULD use document fragments for batch DOM updates
- The chat view MUST clear previous content before rendering new content
- The chat view MUST handle large message content without blocking the UI

### Responsive Design
- The chat view MUST use Bootstrap classes for responsive layout
- Message bubbles MUST adapt to different screen sizes
- The chat view MUST work on mobile and desktop viewports
- Message content MUST handle long lines properly (word wrap)

### Search Query Management
- The chat view MUST accept a search query for highlighting
- The search query MUST be updated before rendering a new conversation
- The search query MUST be used for highlighting in message content

### Zero Messages State
- When a conversation has no messages, the chat view MUST display "No messages in this conversation"
- This message MUST be centered and muted

### Accessibility
- Messages SHOULD use semantic HTML elements
- Code blocks SHOULD have proper language attributes
- The chat view SHOULD maintain proper heading hierarchy
- Icons SHOULD have appropriate aria-labels
