const Joi = require('joi');

const schemas = {
  createUser: Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    preferences: Joi.object({
      difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
      focus: Joi.array().items(Joi.string())
    }),
    baselineKnowledge: Joi.object()
  }),
  updateProgress: Joi.object({
    topic: Joi.string().required(),
    score: Joi.number().min(0).max(100).required(),
    quality: Joi.number().min(0).max(5).required()
  }),
  explain: Joi.object({
    concept: Joi.string().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner')
  }),
  quizGenerate: Joi.object({
    topic: Joi.string().required(),
    count: Joi.number().min(1).max(10).default(3)
  }),
  quizSubmit: Joi.object({
    userId: Joi.string().required(),
    topic: Joi.string().required(),
    score: Joi.number().min(0).max(100).required(),
    quality: Joi.number().min(0).max(5).required(),
    interval: Joi.number().required(),
    repetitions: Joi.number().required(),
    easeFactor: Joi.number().required()
  }),
  tutorChat: Joi.object({
    history: Joi.array().items(Joi.object({
      role: Joi.string().valid('user', 'model').required(),
      content: Joi.string().required()
    })).required(),
    message: Joi.string().required()
  }),
  tts: Joi.object({
    text: Joi.string().required()
  })
};

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ error: 'Validation Error', messages });
    }
    next();
  };
};

module.exports = { schemas, validate };
