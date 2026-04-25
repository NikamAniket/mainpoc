const adaptiveEngine = require('../src/services/adaptiveEngine');

describe('Adaptive Engine - SM-2 Logic', () => {
  test('should increase interval for high quality response', () => {
    const result = adaptiveEngine.calculateNextReview(5, 1, 1, 2.5);
    expect(result.interval).toBeGreaterThan(1);
    expect(result.repetitions).toBe(2);
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  test('should reset interval to 1 for poor response', () => {
    const result = adaptiveEngine.calculateNextReview(1, 6, 2, 2.5);
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
  });
});

describe('Adaptive Engine - Difficulty Adjustment', () => {
  test('should level up for high score', () => {
    const nextLevel = adaptiveEngine.adjustDifficulty(0.9, 'beginner');
    expect(nextLevel).toBe('intermediate');
  });

  test('should stay same for average score', () => {
    const nextLevel = adaptiveEngine.adjustDifficulty(0.6, 'beginner');
    expect(nextLevel).toBe('beginner');
  });

  test('should level down for very low score', () => {
    const nextLevel = adaptiveEngine.adjustDifficulty(0.2, 'intermediate');
    expect(nextLevel).toBe('beginner');
  });
});
