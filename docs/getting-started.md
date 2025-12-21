# Getting Started

This guide will help you start using LLM Conversations Viewer to browse your ChatGPT and Claude conversation exports.

## Installation

There's no installation required!
This is a client-side web application that runs entirely in your browser.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Conversation export files from ChatGPT or Claude

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

## Uploading Conversations

Once you have your export files, there are two ways to upload them:

### Method 1: Click to Upload

1. Click the **Upload** button in the sidebar
2. Select your `conversations.json` or `.zip` file
3. The conversations will be automatically parsed and added to the sidebar

### Method 2: Drag and Drop

1. Drag your `conversations.json` or `.zip` file from your file explorer
2. Drop it anywhere on the page
3. The conversations will be automatically parsed and added to the sidebar

!!! tip "Batch Upload"
    You can upload multiple files at once by selecting them together or dragging multiple files.

## Viewing Conversations

1. After uploading, your conversations appear in the left sidebar
2. Click on any conversation title to view it
3. Messages are rendered with markdown formatting and syntax highlighting
4. Scroll through the conversation history

## Managing Conversations

### Deleting Conversations

To delete a conversation from your browser:

1. Hover over the conversation in the sidebar
2. Click the delete (×) button
3. Confirm the deletion

!!! warning "Permanent Deletion"
    Deleted conversations are removed from browser localStorage and cannot be recovered. Make sure you have the original export file if you need it later.

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
