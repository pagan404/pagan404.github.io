// Small script to convert text to morse and back

// Morse code dictionary
const textMorse = {
  'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
  'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
  'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': ' '
};

// Reverse Morse code dictionary
const morseText = Object.entries(textMorse).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

// Function to convert text to Morse code
function textToMorse(text) {
  return text.toLowerCase().split('').map(char => textMorse[char] || '').join(' ');
}

// Function to convert Morse code to text
function morseToText(morse) {
  return morse
    .trim()
    .split('  ')
    .map(
      word => word
        .split(' ') // Split by single space to get letters
        .map(code => morseText[code] || '')
        .join('')
    )
    .join(' ');
}

// Example usage
const text = "This is a test";
const morse = "- .... .. ...   .. ...   .-   - . ... -";
console.log(textToMorse(text));
console.log(morseToText(morse));


// In case you're wondering, morse code does not support capital letters, so the conversion is case-insensitive.

module.exports = {
    textToMorse,
    morseToText
};