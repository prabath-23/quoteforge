const STORAGE_KEY = 'quoteforge_quote_counter';

export const getNextQuoteNumber = () => {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  const next = stored + 1;
  localStorage.setItem(STORAGE_KEY, String(next));
  return `QT-${String(next).padStart(3, '0')}`;
};
