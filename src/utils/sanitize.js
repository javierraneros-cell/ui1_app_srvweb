function sanitizePlainText(input) {
  return String(input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  sanitizePlainText
};
