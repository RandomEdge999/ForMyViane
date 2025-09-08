const { getStoredHighScore } = require('../highscore');

describe('getStoredHighScore', () => {
  test('returns 0 when no value is stored', () => {
    const storage = { getItem: () => null };
    expect(getStoredHighScore(storage)).toBe(0);
  });

  test('parses stored high score as integer', () => {
    const storage = { getItem: () => '42' };
    expect(getStoredHighScore(storage)).toBe(42);
  });

  test('returns 0 for non-numeric values', () => {
    const storage = { getItem: () => 'not-a-number' };
    expect(getStoredHighScore(storage)).toBe(0);
  });
});
