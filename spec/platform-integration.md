# Platform Integration Specification

## Overview
This specification defines the requirements for integrating with LLM platforms (OpenAI/ChatGPT, Claude/Anthropic, and Z.ai) to enable users to continue conversations on their original platforms.

## Requirements

### Platform URL Generation
- The system MUST generate URLs to continue conversations on original platforms
- URLs MUST be based on conversation format and conversation ID
- The system MUST return null for unsupported formats
- The system MUST return null for missing conversation data

### Supported Platforms

#### OpenAI (ChatGPT)
- Format identifier: `openai`
- Base URL: `https://chatgpt.com/c/`
- URL pattern: `https://chatgpt.com/c/{conversationId}`
- The conversation ID MUST be appended to the base URL

#### Claude (Anthropic)
- Format identifier: `claude`
- Base URL: `https://claude.ai/chat/`
- URL pattern: `https://claude.ai/chat/{conversationId}`
- The conversation ID (UUID) MUST be appended to the base URL

#### Z.ai
- Format identifier: `zai`
- Base URL: `https://chat.z.ai/c/`
- URL pattern: `https://chat.z.ai/c/{conversationId}`
- The conversation ID MUST be appended to the base URL

### URL Generation API
- The system MUST provide a `getPlatformUrl(conversation)` function
- The function MUST accept a normalized conversation object
- The function MUST return a URL string or null
- The function MUST validate conversation object structure
- The function MUST validate conversation.id exists
- The function MUST validate conversation.format exists

### Platform Name Display
- The system MUST provide a `getPlatformName(format)` function
- The function MUST accept a format identifier string
- The function MUST return the platform display name
- OpenAI format MUST return "ChatGPT"
- Claude format MUST return "Claude"
- Z.ai format MUST return "Z.ai"
- Unknown formats MUST return "Unknown Platform"

### Continue Conversation Button
- The button MUST be displayed in the chat view header
- The button MUST only display when a valid platform URL is available
- The button MUST be hidden for unsupported formats
- The button MUST link to the generated platform URL
- The button MUST open in a new tab/window
- The button SHOULD have appropriate iconography (optional)

### Validation
- URL generation MUST validate conversation object is not null/undefined
- URL generation MUST validate conversation.id is present
- URL generation MUST validate conversation.format is present
- URL generation MUST return null for invalid input
- The system MUST not throw exceptions for invalid input

### Error Handling
- The system MUST handle missing conversation data gracefully
- The system MUST return null for unsupported formats
- The system MUST not throw uncaught exceptions
- The system SHOULD log errors for debugging (optional)

### Security
- Generated URLs MUST use HTTPS protocol
- URLs MUST be properly encoded (conversation IDs typically don't require encoding)
- The system MUST not expose sensitive information in URLs
- The system MUST validate conversation IDs before use (basic null check)

### Extensibility
- The system architecture MUST support adding new platforms
- New platforms MUST follow the existing URL generation pattern
- The format-to-URL mapping MUST be easily extensible
- Adding a new platform SHOULD require minimal code changes

### Integration with Chat View
- The chat view MUST call `getPlatformUrl` when rendering a conversation
- The chat view MUST update the continue button href based on the URL
- The chat view MUST hide the button if URL is null
- The chat view MUST display the button if URL is valid

### Browser Behavior
- Clicking the continue conversation link MUST open the platform URL
- The link SHOULD open in a new tab (`target="_blank"` recommended)
- The link SHOULD include `rel="noopener noreferrer"` for security

### Testing Considerations
- URL generation MUST be testable with mock conversation objects
- Each platform URL format MUST be verified
- Edge cases (null conversation, missing ID) MUST be tested
- The system SHOULD handle changes to platform URL patterns gracefully
