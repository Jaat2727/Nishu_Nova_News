// Quick test for the Gemini AI integration using the official SDK
require('dotenv').config({ path: 'backend/.env' });
const { GoogleGenerativeAI } = require('./backend/node_modules/@google/generative-ai');

async function testGemini() {
  console.log('🔑 API Key configured:', !!process.env.GEMINI_API_KEY);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('📡 Calling Gemini 2.0 Flash...');
    const result = await model.generateContent('Summarize in 1 sentence: Breaking news, AI gets smarter every day.');
    const text = result.response.text();

    console.log('✅ SUCCESS:', text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
