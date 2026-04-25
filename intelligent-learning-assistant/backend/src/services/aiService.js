const { VertexAI } = require('@google-cloud/vertexai');
const logger = require('../middleware/logger');

// Initialize Vertex AI with your project and location
const vertex_ai = new VertexAI({
  project: process.env.FIREBASE_PROJECT_ID, // Reusing project ID from Firebase
  location: process.env.GCP_LOCATION || 'us-central1'
});

const model = 'gemini-1.5-flash';

// Instantiate the models
const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
});

class AIService {
  async generateExplanation(concept, level = 'beginner') {
    try {
      const prompt = `Explain the concept of "${concept}" for a ${level} learner. Use analogies and keep it engaging. Format the output as markdown.`;
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      return response.candidates[0].content.parts[0].text;
    } catch (error) {
      logger.error(`Error generating explanation (Vertex AI): ${error.message}`);
      throw error;
    }
  }

  async generateQuiz(topic, count = 3) {
    try {
      const prompt = `Generate ${count} multiple-choice questions about "${topic}". 
      Return the response in JSON format with the following structure:
      {
        "questions": [
          {
            "id": "string",
            "question": "string",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "string",
            "explanation": "string"
          }
        ]
      }`;
      
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      // Basic JSON extraction in case Gemini adds markdown blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error(`Error generating quiz (Vertex AI): ${error.message}`);
      throw error;
    }
  }

  async tutorChat(history, message) {
    try {
      const chat = generativeModel.startChat({
        history: history.map(h => ({
          role: h.role, // 'user' or 'model'
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      const response = result.response;
      return response.candidates[0].content.parts[0].text;
    } catch (error) {
      logger.error(`Error in tutor chat (Vertex AI): ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AIService();
