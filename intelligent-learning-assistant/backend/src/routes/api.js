const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const learningController = require('../controllers/learningController');

// User Routes
router.post('/users', userController.createUserProfile);
router.get('/users/:userId', userController.getUserProfile);
router.patch('/users/:userId/progress', userController.updateUserProgress);

// Learning Routes
router.get('/learning/explain', learningController.getExplanation);
router.post('/learning/quiz/generate', learningController.generateQuiz);
router.post('/learning/quiz/submit', learningController.submitQuizResult);
router.post('/learning/tutor/chat', learningController.tutorChat);

module.exports = router;
