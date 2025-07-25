require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing');
console.log('NSCALE_API_KEY:', process.env.NSCALE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NSCALE_BASE_URL:', process.env.NSCALE_BASE_URL ? '✅ Set' : '❌ Missing');
console.log('NSCALE_MODEL:', process.env.NSCALE_MODEL ? '✅ Set' : '❌ Missing');
console.log('');

// Test OpenAI client
async function testOpenAIClient() {
    try {
        console.log('🔍 Testing OpenAI Client...');
        const { openaiClient } = require('./dist/src/bot/utils/openai-client');
        console.log('OpenAI client created successfully ✅');
        return true;
    } catch (error) {
        console.error('OpenAI client error ❌:', error.message);
        return false;
    }
}

// Test translation function
async function testTranslation() {
    try {
        console.log('🔍 Testing Translation Function...');
        const { translateToPersian } = require('./dist/src/bot/utils/translate-to-persian');
        
        const result = await translateToPersian('Hello world');
        console.log('Translation result:', result);
        
        if (result.translation) {
            console.log('Translation successful ✅');
            return true;
        } else {
            console.log('Translation returned empty result ❌');
            return false;
        }
    } catch (error) {
        console.error('Translation error ❌:', error.message);
        return false;
    }
}

// Test explanation function
async function testExplanation() {
    try {
        console.log('🔍 Testing Explanation Function...');
        const { explainCorrection } = require('./dist/src/bot/utils/explain-correction');
        
        const result = await explainCorrection('I are going to store');
        console.log('Explanation result:', result);
        
        if (result.corrected && result.explanation) {
            console.log('Explanation successful ✅');
            return true;
        } else {
            console.log('Explanation returned incomplete result ❌');
            return false;
        }
    } catch (error) {
        console.error('Explanation error ❌:', error.message);
        return false;
    }
}

// Test correction function
async function testCorrection() {
    try {
        console.log('🔍 Testing Correction Function...');
        const { correctSentence } = require('./dist/src/bot/utils/correct-sentence');
        
        const result = await correctSentence('I are going to store');
        console.log('Correction result:', result);
        
        if (result.corrected) {
            console.log('Correction successful ✅');
            return true;
        } else {
            console.log('Correction returned empty result ❌');
            return false;
        }
    } catch (error) {
        console.error('Correction error ❌:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting comprehensive debug tests...\n');
    
    const openaiTest = await testOpenAIClient();
    console.log('');
    
    if (openaiTest) {
        await testCorrection();
        console.log('');
        
        await testTranslation();
        console.log('');
        
        await testExplanation();
        console.log('');
    }
    
    console.log('🏁 Debug tests completed!');
    console.log('');
    console.log('If all tests passed, the issue might be:');
    console.log('1. Telegram bot token or webhook configuration');
    console.log('2. Network connectivity to Telegram');
    console.log('3. Bot permissions or inline keyboard issues');
    console.log('4. User interaction timing or cache expiry');
}

runTests().catch(console.error);
