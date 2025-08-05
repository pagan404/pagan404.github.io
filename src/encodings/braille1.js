// Small script to convert text to braille and back

// Braille code dictionary
const textBraille = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
  ' ':' '
};
  
// Reverse Braille code dictionary
const brailleText = Object.entries(textBraille).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});
  
// Function to convert text to Braille code
function textToBraille(text) {
  return text.toLowerCase().split('').map(char => textBraille[char] || '').join('');
}
  
// Function to convert Braille code to text
function brailleToText(braille) {
  return braille.split('').map(code => brailleText[code] || '').join('');
}

// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (for tests)
    module.exports = {
        textToBraille,
        brailleToText
    };
} else {
    // Browser environment (for website)
    // Functions are already globally available
    // No action needed - they're declared with 'function' keyword
}
