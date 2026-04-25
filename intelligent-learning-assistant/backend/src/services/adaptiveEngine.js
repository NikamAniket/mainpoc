const logger = require('../middleware/logger');

class AdaptiveEngine {
  /**
   * SM-2 Spaced Repetition Algorithm
   * @param {number} quality - 0-5 (0: total failure, 5: perfect response)
   * @param {number} interval - Previous interval in days
   * @param {number} repetitions - Previous number of successful repetitions
   * @param {number} easeFactor - Previous ease factor
   * @returns {Object} { interval, repetitions, easeFactor, nextDate }
   */
  calculateNextReview(quality, interval, repetitions, easeFactor) {
    let nextInterval;
    let nextRepetitions;
    let nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

    if (quality >= 3) {
      if (repetitions === 0) {
        nextInterval = 1;
      } else if (repetitions === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(interval * nextEaseFactor);
      }
      nextRepetitions = repetitions + 1;
    } else {
      nextInterval = 1;
      nextRepetitions = 0;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);

    return {
      interval: nextInterval,
      repetitions: nextRepetitions,
      easeFactor: nextEaseFactor,
      nextDate: nextDate.toISOString(),
    };
  }

  /**
   * Determine the next topic difficulty level
   * @param {number} score - 0-1 percentage score
   * @param {string} currentLevel - 'beginner', 'intermediate', 'advanced'
   */
  adjustDifficulty(score, currentLevel) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentLevel);

    if (score > 0.8 && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    } else if (score < 0.4 && currentIndex > 0) {
      return levels[currentIndex - 1];
    }
    return currentLevel;
  }
}

module.exports = new AdaptiveEngine();
