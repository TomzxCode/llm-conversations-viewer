# Sidebar UI Specification

## Overview
This specification defines the requirements for the sidebar component that displays and manages the list of conversations in the LLM Conversations Viewer.

## Requirements

### Conversation List Display
- The sidebar MUST display a list of all loaded conversations
- The sidebar MUST show an empty state when no conversations are loaded
- The sidebar MUST show a "no results" state when search returns no matches
- Conversations MUST be sorted by update time (most recent first)
- The sidebar MUST highlight the currently selected conversation

### Conversation List Item
Each conversation item MUST display:
- Conversation title (truncated if too long)
- Format badge (OpenAI, Claude, or Z.ai)
- Message count
- Relative date (Today, Yesterday, X days ago, or date)
- Checkbox for selection

### Search Functionality
- The sidebar MUST provide a search input field
- Search MUST filter conversations in real-time as the user types
- Search MUST be case-insensitive
- Search MUST split queries into words and match all words
- Search MUST check conversation titles
- Search MUST check message content
- Search MUST highlight matching words in titles
- Search highlighting MUST use `<mark>` tags with `search-highlight` class
- The sidebar MUST update the list immediately on search input

### Selection Management
- The sidebar MUST provide checkboxes for each conversation
- The sidebar MUST support selecting multiple conversations
- The sidebar MUST provide a "Select All" button
- The sidebar MUST provide a "Select None" button
- "Select All" MUST select only currently visible (filtered) conversations
- Checkbox clicks MUST NOT trigger conversation selection
- The sidebar MUST notify listeners of selection changes
- Selection state MUST be preserved across search operations

### Conversation Selection
- Clicking a conversation item MUST select it
- Selecting a conversation MUST update the active state
- Selecting a conversation MUST notify registered listeners
- Only one conversation may be active at a time
- The active conversation MUST have visual distinction

### Format Badges
- OpenAI conversations MUST display a green "OpenAI" badge
- Claude conversations MUST display a blue "Claude" badge
- Z.ai conversations MUST display a light blue "Z.ai" badge
- Unknown formats MUST display a gray "Unknown" badge

### Date Formatting
- Today's conversations MUST display "Today"
- Yesterday's conversations MUST display "Yesterday"
- Conversations less than 7 days old MUST display "Xd ago"
- Conversations less than 30 days old MUST display "Xw ago"
- Older conversations MUST display "Month Day" format

### Empty State
- The empty state MUST display an icon
- The empty state MUST display "No conversations loaded" text
- The empty state MUST display instructions for loading conversations

### No Results State
- The no results state MUST display a search icon
- The no results state MUST display "No conversations found" text
- The no results state MUST suggest trying different search terms

### Text Highlighting
- Search matches in titles MUST be highlighted
- Highlighting MUST preserve original text casing
- Special regex characters in search terms MUST be escaped
- HTML content MUST be escaped before highlighting to prevent XSS

### XSS Prevention
- All user-generated text MUST be HTML-escaped before display
- Title text MUST be escaped before rendering
- Search highlighting MUST not introduce XSS vulnerabilities
- The sidebar MUST use a dedicated escape function for HTML content

### Event Callbacks
- The sidebar MUST support registering a selection callback
- The sidebar MUST support registering a selection change callback
- The selection callback MUST receive the conversation ID
- The selection change callback MUST receive an array of selected IDs
- Multiple callbacks MAY be registered for the same event

### Rendering Performance
- The sidebar MUST handle large conversation lists efficiently
- The sidebar SHOULD use document fragments for batch DOM updates
- The sidebar MUST clear previous content before rendering new content

### Responsive Design
- The sidebar MUST use Bootstrap classes for responsive layout
- Conversation items MUST use flexbox for proper alignment
- Long titles MUST be truncated with `text-truncate` class
- The sidebar MUST work on mobile and desktop viewports

### State Management
- The sidebar MUST maintain a list of all conversations
- The sidebar MUST maintain the current search query
- The sidebar MUST maintain a set of selected conversation IDs
- The sidebar MUST maintain the currently active conversation ID

### Accessibility
- Conversation items MUST be keyboard accessible
- Checkboxes MUST have proper labels
- Icons MUST have appropriate aria-labels
- The sidebar SHOULD use semantic HTML elements
