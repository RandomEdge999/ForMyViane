function getStoredHighScore(storage = typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null }) {
  const stored = storage.getItem('vianeHighScore');
  if (!stored) return 0;
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? 0 : parsed;
}

if (typeof module !== 'undefined') {
  module.exports = { getStoredHighScore };
}
