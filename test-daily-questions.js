require('dotenv').config();

console.log('🧪 Testing Daily Question System...\n');

async function testQuestionGeneration() {
    try {
        console.log('🔍 Testing Question Generator Service...');
        
        const { QuestionGeneratorService } = require('./dist/src/bot/services/question-generator.service');
        const questionGenerator = new QuestionGeneratorService();
        
        console.log('🎲 Generating a test question...');
        const question = await questionGenerator.generateDailyQuestion([], 'conversation', 'intermediate');
        
        console.log('✅ Question generated successfully!');
        console.log('📝 Question:', question.question);
        console.log('📊 Type:', question.type);
        console.log('📈 Difficulty:', question.difficulty);
        console.log('🎯 Expected Engagement:', question.expectedEngagement);
        
        return true;
    } catch (error) {
        console.error('❌ Question generation failed:', error.message);
        return false;
    }
}

async function testThemedQuestion() {
    try {
        console.log('\n🎨 Testing Themed Question Generation...');
        
        const { QuestionGeneratorService } = require('./dist/src/bot/services/question-generator.service');
        const questionGenerator = new QuestionGeneratorService();
        
        const themedQuestion = await questionGenerator.generateThemedQuestion('fun-friday', 'intermediate');
        
        console.log('✅ Themed question generated successfully!');
        console.log('🎉 Friday Question:', themedQuestion.question);
        console.log('📊 Type:', themedQuestion.type);
        
        return true;
    } catch (error) {
        console.error('❌ Themed question generation failed:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting Daily Question System Tests...\n');
    
    const questionTest = await testQuestionGeneration();
    const themedTest = await testThemedQuestion();
    
    console.log('\n📋 Test Results:');
    console.log('🎯 Question Generation:', questionTest ? '✅ PASSED' : '❌ FAILED');
    console.log('🎨 Themed Questions:', themedTest ? '✅ PASSED' : '❌ FAILED');
    
    if (questionTest && themedTest) {
        console.log('\n🎉 All tests passed! Your daily question system is ready!');
        console.log('\n📚 Available Commands:');
        console.log('• /daily_questions - Enable daily questions in a group');
        console.log('• /manual_question - Send a question immediately');
        console.log('• /themed_question [theme] - Send a themed question');
        console.log('• /question_stats - View group statistics');
        console.log('• /disable_questions - Disable daily questions');
        console.log('\n⏰ Cron Job: Questions will be sent daily at 9:00 AM UTC');
    } else {
        console.log('\n❌ Some tests failed. Please check your configuration.');
    }
}

runTests().catch(console.error);
