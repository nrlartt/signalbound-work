export default function camelCase(input, options = {}) {
  const {
    pascalCase = false,
    preserveConsecutiveUppercase = false,
    locale = undefined
  } = options;

  if (typeof input === 'string') {
    if (input === '') {
      return '';
    }
  } else if (Array.isArray(input)) {
    input = input.join('-');
  } else {
    throw new TypeError("Input must be a string or an array of strings");
  }

  const words = input
    .toLowerCase(locale)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  const result = words.map((word, index) => {
    if (index === 0 && !pascalCase) {
      return word;
    }
    return word.charAt(0).toUpperCase(locale) + word.slice(1);
  }).join('');

  return result;
}