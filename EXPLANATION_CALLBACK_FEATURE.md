# Explanation Callback Feature 🧠

This feature adds explanation capability to the EngliFix bot using callback queries instead of commands. When a grammar correction is provided, premium users can click an inline button to get detailed explanations of the changes made.

## How It Works

1. **User sends message**: User sends an English message with grammar errors
2. **Bot corrects**: Bot analyzes and corrects the grammar
3. **Inline buttons**: Bot replies with corrected text and two buttons: "🇮🇷 Translate to Persian" and "🧠 Explain Changes"
4. **User clicks explain**: Premium users can click the explain button to get detailed explanations
5. **Message updated**: Original message is edited to show original text, corrected text, and detailed explanation

## Example Flow

```
User: "I are going to store yesterday"
Bot: "✅ I am going to the store yesterday"
     [🇮🇷 Translate to Persian] [🧠 Explain Changes]

Premium user clicks "Explain Changes" →

Bot (edited message):
"📝 Original: I are going to store yesterday

✅ Correction: I am going to the store yesterday

🧠 Explanation:
- Changed 'I are' to 'I am': Subject-verb agreement - first person singular 'I' requires 'am', not 'are'
- Added 'the' before 'store': Article needed - 'the store' is more natural than 'store' when referring to a specific store
- Consider changing 'yesterday' to 'today' for temporal consistency with 'am going' (present continuous)"
```

## Technical Implementation

### New Files Added:

- `src/bot/utils/explanation-cache.ts` - In-memory cache for explanation callback data
- `src/bot/handlers/callbacks/explain.callback.handler.ts` - Callback query handler for explanations

### Modified Files:

- `src/bot/utils/message-queue.ts` - Added "Explain Changes" button to correction replies
- `src/bot/index.ts` - Registered explanation callback handler, removed old explain command
- Removed: `src/bot/handlers/commands/explain.command.handler.ts` - Old command-based implementation

### Key Features:

- **Premium Only**: Explanation feature is restricted to premium subscribers
- **Smart Caching**: Uses short IDs to bypass Telegram's 64-byte callback data limit
- **User Verification**: Ensures only the requesting user can access their explanation data
- **Comprehensive Error Handling**: Handles expired data, unauthorized access, and API failures
- **Loading Indicators**: Shows explanation generation progress to users
- **Security**: Validates user ownership of explanation requests
- **Automatic Cleanup**: Cache automatically expires after 1 hour

## Differences from Command-Based Approach

### Before (Command Handler):
- Required typing `/explain [sentence]`
- Immediate processing and response
- No connection to the original correction context
- Premium check at command execution

### After (Callback Query):
- Click button on corrected messages
- Connected to the original correction context
- Better user experience with inline interaction
- Premium check at callback execution
- Maintains context between correction and explanation

## Configuration

The explanation feature uses the same OpenAI model as grammar correction. Make sure your environment variables are set:

```env
NSCALE_MODEL=your_openai_model
OPENAI_API_KEY=your_openai_api_key
```

## Benefits of Callback Query Approach

1. **Better UX**: No need to retype or copy-paste sentences
2. **Context Preservation**: Maintains link between original message, correction, and explanation
3. **Reduced Friction**: One click instead of typing a command
4. **Visual Integration**: Buttons appear directly on correction messages
5. **Progressive Disclosure**: Users only see explanations when they want them
6. **Cache Efficiency**: Reuses correction data without redundant API calls

## Performance Considerations

- **Cache Management**: Explanation cache automatically cleans up expired entries
- **Memory Usage**: In-memory cache suitable for moderate usage; consider Redis for high-volume deployments
- **API Efficiency**: Only generates explanations when explicitly requested
- **Rate Limiting**: Inherits existing rate limiting from correction system
- **Premium Gating**: Reduces load by restricting feature to premium users

## Future Enhancements

- Support for multiple explanation languages
- Explanation confidence scoring
- Grammar rule categorization
- Learning progress tracking
- Personalized explanation complexity levels
