// Small script to convert text to braille and back - Braille 1

// Braille code dictionary
const textBraille1 = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
  ' ':' '
};
  
// Reverse Braille code dictionary
const braille1Text = Object.entries(textBraille1).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});
  
// Function to convert text to Braille code
function textToBraille1(text) {
  return text.toLowerCase().split('').map(char => textBraille1[char] || '').join('');
}
  
// Function to convert Braille code to text
function braille1ToText(braille) {
  return braille.split('').map(code => braille1Text[code] || '').join('');
}

// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (for tests)
    module.exports = {
        textToBraille1,
        braille1ToText
    };
} else {
    // Browser environment (for website)
    window.textToBraille1 = textToBraille1;
    window.braille1ToText = braille1ToText;
}
