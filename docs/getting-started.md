# Getting Started

This guide will help you start using LLM Conversations Viewer to browse your ChatGPT, Claude, and Z.ai conversation exports.

## Installation

There's no installation required!
This is a client-side web application that runs entirely in your browser.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Conversation export files from ChatGPT, Claude, or Z.ai

## Exporting Conversations

### From ChatGPT (OpenAI)

2. Click on your profile in the bottom left
3. Select **Settings** → **Data controls** → **Export data**
4. Click **Export**
5. Wait for the email with your data export
6. Download the ZIP file

### From Claude (Anthropic)

1. Click on your profile in the bottom left
2. Select **Settings** → **Privacy** → **Export Data**
3. Click **Export Data**
4. Wait for the email with your data export
5. Download the ZIP file

### From Z.ai

1. Click on your profile in the top right
2. Select **Settings** → **Dialogue** → **Export Chats**
3. The conversations will be exported and a download will start automatically

!!! note "Z.ai Export Format"
    Z.ai exports conversations in a JSON format that includes conversation trees, model information, and usage statistics. The viewer automatically detects and parses this format.

## Loading Conversations

Once you have your export files, there are three ways to load them:

### Method 1: Click to Upload

1. Click the **Upload** button in the sidebar
2. Select your `conversations.json` or `.zip` file
3. The conversations will be automatically parsed and saved to IndexedDB

### Method 2: Drag and Drop

1. Drag your `conversations.json` or `.zip` file from your file explorer
2. Drop it anywhere on the page
3. The conversations will be automatically parsed and saved to IndexedDB

### Method 3: Load from URL

You can load conversations directly from a URL without persisting them to IndexedDB. This is useful for sharing conversations or viewing them temporarily.

**Option A: Via URL Parameter**

Open the viewer with a URL parameter:
```
index.html?url=https://example.com/conversations.json
```

The file will automatically load when the page opens.

**Option B: Via Input Field**

1. Enter a URL in the "Import from URL..." field in the sidebar
2. Click the download button or press Enter
3. The conversations will load temporarily (not saved to IndexedDB)

!!! info "URL Import Behavior"
    Conversations loaded from URLs are **not persisted** to IndexedDB. They will be cleared when you refresh the page or load a different file. This is by design to avoid storing potentially large files from external sources.

!!! tip "Batch Upload"
    You can upload multiple files at once by selecting them together or dragging multiple files (Methods 1 & 2 only).

## Viewing Conversations

1. After uploading, your conversations appear in the left sidebar
2. Click on any conversation title to view it
3. Messages are rendered with markdown formatting and syntax highlighting
4. Scroll through the conversation history

## Continuing Conversations

Once you've viewed a conversation, you can continue it on its original platform:

1. Select a conversation to view it
2. Look for the **"Continue conversation"** button in the top-right of the chat header (next to the Export button)
3. Click the button to open the conversation in a new tab on the original platform:
   - **OpenAI conversations** open at `https://chatgpt.com/c/{conversation-id}`
   - **Claude conversations** open at `https://claude.ai/chat/{conversation-id}`
   - **Z.ai conversations** - Platform URL support coming soon

!!! tip "Quick Platform Access"
    The "Continue conversation" button provides a fast way to jump from reviewing historical conversations back to actively working on them in ChatGPT or Claude.

## Searching and Filtering Conversations

The viewer includes a powerful search feature to help you quickly find specific conversations:

### Basic Search

1. Locate the search box at the top of the sidebar (below the upload section)
2. Type your search query into the "Search conversations..." field
3. The conversation list will automatically filter as you type

### How Search Works

The search feature:

- **Searches multiple fields**: Looks for matches in both conversation titles and message content
- **Word-based matching**: Splits your search query into individual words and finds conversations where all words appear
- **Order-independent**: Words can appear in any order (e.g., searching "authentication javascript" finds conversations containing both words anywhere)
- **Case-insensitive**: Searches work regardless of capitalization
- **Real-time filtering**: Results update instantly as you type

### Search Highlighting

- When you have an active search query, matching keywords are **highlighted in yellow** within conversation titles
- This makes it easy to see why a particular conversation matched your search
- Multiple matching words are all highlighted independently

### Examples

- Search for **"header values"** to find conversations about working with HTTP headers
- Search for **"javascript X-"** to find conversations about custom headers in JavaScript
- Search for **"authentication"** to find all conversations related to auth topics

### Clearing Search

Simply clear the search box to show all conversations again.

## Managing Conversations

### Deleting Conversations

To delete a conversation from your browser:

1. Hover over the conversation in the sidebar
2. Click the delete (×) button
3. Confirm the deletion

!!! warning "Permanent Deletion"
    Deleted conversations are removed from browser IndexedDB and cannot be recovered. Make sure you have the original export file if you need it later.

### Clearing All Data

To clear all stored conversations:

1. Open browser developer tools (F12)
2. Go to the **Application** or **Storage** tab
3. Find **Local Storage** → your domain
4. Clear the storage

## Next Steps

- Learn about the [Architecture](architecture.md) to understand how the app works
- Check the [Supported Formats](formats.md) for detailed format specifications
- Explore the [Development Guide](development.md) if you want to contribute
