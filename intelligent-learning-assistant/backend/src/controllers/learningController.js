const aiService = require('../services/aiService');
const adaptiveEngine = require('../services/adaptiveEngine');
const db = require('../services/dbService');
const logger = require('../middleware/logger');
const textToSpeech = require('@google-cloud/text-to-speech');

const ttsClient = new textToSpeech.TextToSpeechClient({
  projectId: process.env.FIREBASE_PROJECT_ID
});

exports.getExplanation = async (req, res) => {
  const { concept, level } = req.query;
  const explanation = await aiService.generateExplanation(concept, level);
  res.json({ concept, level, explanation });
};

exports.generateQuiz = async (req, res) => {
  const { topic, count } = req.body;
  const quiz = await aiService.generateQuiz(topic, count);
  res.json(quiz);
};

exports.submitQuizResult = async (req, res) => {
  const { userId, topic, score, quality, interval, repetitions, easeFactor } = req.body;
  
  // Calculate next review using Adaptive Engine
  const nextReview = adaptiveEngine.calculateNextReview(quality, interval, repetitions, easeFactor);
  
  // Update user's learning path/session in Firestore
  const sessionData = {
    userId,
    topic,
    score,
    nextReviewDate: nextReview.nextDate,
    updatedAt: new Date().toISOString()
  };
  
  await db.collection('learning_paths').add(sessionData);
  
  res.json({
    message: 'Quiz result processed',
    nextReview,
    sessionData
  });
};

exports.tutorChat = async (req, res) => {
  const { history, message } = req.body;
  const response = await aiService.tutorChat(history, message);
  res.json({ response });
};

exports.generateSpeech = async (req, res) => {
  const { text } = req.body;
  try {
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', name: 'en-US-Journey-F' }, // Premium Journey Voice
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.audioContent.length
    });
    res.send(response.audioContent);
  } catch (error) {
    logger.error(`TTS Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
};
