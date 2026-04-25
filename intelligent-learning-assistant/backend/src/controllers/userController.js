const db = require('../services/dbService');
const logger = require('../middleware/logger');

exports.createUserProfile = async (req, res) => {
  const { userId, name, preferences, baselineKnowledge } = req.body;
  
  const userProfile = {
    name,
    preferences: preferences || { difficulty: 'beginner', focus: [] },
    skillLevel: 'beginner',
    masteryLevels: {},
    streaks: 0,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  await db.collection('users').doc(userId).set(userProfile);
  
  res.status(201).json({ message: 'User profile created', profile: userProfile });
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const doc = await db.collection('users').doc(userId).get();
  
  if (!doc.exists) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(doc.data());
};

exports.updateUserProgress = async (req, res) => {
  const { userId } = req.params;
  const { topic, score, quality } = req.body;
  
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
  
  const userData = userDoc.data();
  const mastery = userData.masteryLevels || {};
  mastery[topic] = (mastery[topic] || 0) + (score * 10); // Simple mastery logic
  
  await userRef.update({
    masteryLevels: mastery,
    lastActive: new Date().toISOString()
  });
  
  res.json({ message: 'Progress updated', mastery });
};
