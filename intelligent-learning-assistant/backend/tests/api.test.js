const request = require('supertest');
const app = require('../src/index');

// Mock external services to prevent hitting live APIs during tests
jest.mock('../src/services/aiService', () => ({
  generateExplanation: jest.fn().mockResolvedValue('Mocked Explanation'),
  generateQuiz: jest.fn().mockResolvedValue({ questions: [] }),
  tutorChat: jest.fn().mockResolvedValue('Mocked AI Response')
}));

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Learning Routes Validation', () => {
    it('should return 400 if explain route is missing concept', async () => {
      const res = await request(app).get('/api/learning/explain');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });

    it('should return 200 for valid explain request', async () => {
      const res = await request(app).get('/api/learning/explain?concept=React');
      expect(res.statusCode).toBe(200);
      expect(res.body.explanation).toBe('Mocked Explanation');
    });
    
    it('should return 400 for chat route with missing history', async () => {
      const res = await request(app).post('/api/learning/tutor/chat').send({ message: 'Hello' });
      expect(res.statusCode).toBe(400);
    });
  });
});
