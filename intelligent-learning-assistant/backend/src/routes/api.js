const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const learningController = require('../controllers/learningController');
const { validate, schemas } = require('../middleware/validator');

// User Routes
router.post('/users', validate(schemas.createUser), userController.createUserProfile);
router.get('/users/:userId', userController.getUserProfile);
router.patch('/users/:userId/progress', validate(schemas.updateProgress), userController.updateUserProgress);

// Learning Routes
router.get('/learning/explain', validate(schemas.explain, 'query'), learningController.getExplanation);
router.post('/learning/quiz/generate', validate(schemas.quizGenerate), learningController.generateQuiz);
router.post('/learning/quiz/submit', validate(schemas.quizSubmit), learningController.submitQuizResult);
router.post('/learning/tutor/chat', validate(schemas.tutorChat), learningController.tutorChat);
router.post('/learning/tts', validate(schemas.tts), learningController.generateSpeech);

module.exports = router;
