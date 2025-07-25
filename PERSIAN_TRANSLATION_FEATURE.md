# Persian Translation Feature 🇮🇷

This feature adds Persian translation capability to the EngliFix bot. When a grammar correction is provided, users can click an inline button to translate the corrected text into Persian.

## How It Works

1. **User sends message**: User sends an English message with grammar errors
2. **Bot corrects**: Bot analyzes and corrects the grammar
3. **Inline button**: Bot replies with corrected text and a "🇮🇷 Translate to Persian" button
4. **User clicks button**: User can click the button to get Persian translation
5. **Message updated**: Original message is edited to show both corrected English and Persian translation

## Example Flow

```
User: "I are going to store yesterday"
Bot: "✅ I am going to the store yesterday"
     [🇮🇷 Translate to Persian]

User clicks button →

Bot (edited message):
"✅ I am going to the store yesterday

🇮🇷 Persian: من دیروز به فروشگاه می‌رفتم"
```

## Technical Implementation

### New Files Added:

- `src/bot/utils/translate-to-persian.ts` - Translation utility using OpenAI
- `src/bot/utils/translation-cache.ts` - In-memory cache for callback data
- `src/bot/handlers/callbacks/translate.callback.handler.ts` - Callback query handler

### Modified Files:

- `src/bot/utils/message-queue.ts` - Added inline button to correction replies
- `src/bot/index.ts` - Registered callback query handler
- `src/bot/interfaces/index.ts` - Export translation interfaces

### Features:

- **Smart Caching**: Uses short IDs to bypass Telegram's 64-byte callback data limit
- **Error Handling**: Comprehensive error handling for translation failures
- **Expiry System**: Translation cache automatically expires after 1 hour
- **Loading Indicators**: Shows translation progress to users
- **Logging**: Detailed logging for debugging and monitoring

## Configuration

The Persian translation uses the same OpenAI model as grammar correction. Make sure your environment variables are set:

```env
NSCALE_MODEL=your_openai_model
OPENAI_API_KEY=your_openai_api_key
```

## Translation Quality

The translation system is designed to:

- Preserve the original meaning and tone
- Use natural, conversational Persian
- Handle technical terms appropriately
- Maintain proper Persian grammar and sentence structure
- Provide contextually appropriate translations

## Performance Considerations

- **Cache Management**: Translation cache automatically cleans up expired entries
- **Memory Usage**: In-memory cache suitable for moderate usage; consider Redis for high-volume deployments
- **API Efficiency**: Only translates when user explicitly requests it
- **Rate Limiting**: Inherits existing rate limiting from correction system

## Future Enhancements

- Support for other languages (Arabic, Turkish, etc.)
- Persistent cache using Redis
- Translation confidence scoring
- Batch translation capabilities
- Voice message translation support
