// Braille 2 converter with unique function names
// Based on braille2.js but with namespaced functions

// Braille grade 2 dictionaries
const lettersBraille2 = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', 
};

const punctuationSpecialSymbolsBraille2 = {
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠦', '!': '⠖', '"': '⠶', '(': '⠐⠣', ')': '⠐⠜', '[': '⠶⠣', ']': '⠶⠜',
  '/': '⠸⠌', '\\': '⠸⠡', '-': '⠤', '_': '⠨⠤', '@': '⠈⠁', '#': '⠨⠼', '$': '⠈⠎', '%': '⠨⠴', '&': '⠈⠯', '*': '⠐⠔', 
  '+': '⠐⠖', '=': '⠐⠶', '<': '⠈⠣', '>': '⠈⠜', '^': '⠈⠢', '~': '⠈⠔', '`': '⠈⠑', '|': '⠸⠳','{': '⠸⠣', '}': '⠸⠜'
}

const numberBraille2 = {
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
};

// Reverse Braille code dictionaries
const braille2Letters = Object.entries(lettersBraille2).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const braille2PunctuationSpecialSymbols = Object.entries(punctuationSpecialSymbolsBraille2).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const braille2Numbers = Object.entries(numberBraille2).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

// Combined Braille code dictionaries
const allBraille2 = Object.assign({}, lettersBraille2, punctuationSpecialSymbolsBraille2, numberBraille2);
const braille2All = Object.assign({}, braille2Letters, braille2PunctuationSpecialSymbols);

// Function to convert text to Braille code
function textToBraille2(text) {
  const words = text.split(' ');
  return words.map(word => convertWordToBraille2(word)).join('⠀');
}

function convertWordToBraille2(word) {
  if (containsMixedCharacters2(word)) {
    return convertMixedCharacters2(word);
  } else if (/[a-z]/.test(word[0])) {
    return convertLowerCase2(word);
  } else if (/[A-Z]/.test(word[0])) {
    return convertUpperCase2(word);
  } else if (/\d/.test(word[0])) {
    return convertNumbers2(word);
  } else {
    return convertPunctuation2(word);
  }
}

function containsMixedCharacters2(word) {
  return (
    word.match(/[a-zA-Z].*[^a-zA-Z]/) ||
    word.match(/[^a-zA-Z].*[a-zA-Z]/) ||
    word.match(/[\d].*[^\d]/) ||
    word.match(/[^\d].*[\d]/)
  );
}

function convertMixedCharacters2(word) {
  if (/[A-Z]/.test(word[0])) {
    word = '⠠' + word.toLowerCase();
  }
  
  let result = '';
  let inNumberMode = false;
  
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    
    if (/\d/.test(char)) {
      if (!inNumberMode) {
        result += '⠼';
        inNumberMode = true;
      }
    } else {
      inNumberMode = false;
    }
    
    result += char;
  }
  
  for (const [key, value] of Object.entries(allBraille2)) {
    if (result.includes(key)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  
  return result;
}

function convertLowerCase2(word) {
  for (const [key, value] of Object.entries(lettersBraille2)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertUpperCase2(word) {
  if (/[A-Z]/.test(word[1])) {
    word = '⠠⠠' + word;
  } else {
    word = '⠠' + word;
  } 
  word = word.toLowerCase();
  for (const [key, value] of Object.entries(lettersBraille2)) {
    word = word.replace(new RegExp(key, 'g'), value);
  }
  return word;
}

function convertNumbers2(word) {
  word = '⠼' + word;
  for (const [key, value] of Object.entries(numberBraille2)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertPunctuation2(word) {
  for (const [key, value] of Object.entries(punctuationSpecialSymbolsBraille2)) {
    if (word.includes(key)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      word = word.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  return word;
}

// Function to convert Braille code to text
function braille2ToText(braille) {
  const words = braille.split('⠀');
  return words.map(word => {
    if (word[0] === '⠼') {
      return convertBrailleNumber2(word);
    } else if (word[0] === '⠠') {
      return convertBrailleUpperCase2(word);
    } else {
      return convertBrailleGeneral2(word);
    }
  }).join(' ');
}

function convertBrailleNumber2(word) {
  word = word.slice(1);
  for (const [key, value] of Object.entries(braille2Numbers)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertBrailleUpperCase2(word) {
  if (word[1] === '⠠') {
    word = word.slice(2);
    for (const [key, value] of Object.entries(braille2All)) {
      if (word.includes(key)) {
        word = word.replace(new RegExp(key, 'g'), value);
      }
    }
    return word.toUpperCase();
  } else {
    word = word.slice(1);
    const firstChar = word[0];
    let upperFirst = braille2All[firstChar];
    if (upperFirst) {
      upperFirst = upperFirst.toUpperCase();
    } else {
      upperFirst = '';
    }
    
    const restOfWord = word.slice(1);
    let translatedRest = restOfWord;
    
    for (const [key, value] of Object.entries(braille2All)) {
      if (translatedRest.includes(key)) {
        translatedRest = translatedRest.replace(new RegExp(key, 'g'), value);
      }
    }
    
    return upperFirst + translatedRest;
  }
}

function convertBrailleGeneral2(word) {
  for (const [key, value] of Object.entries(braille2All)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        textToBraille2,
        braille2ToText
    };
} else {
    window.textToBraille2 = textToBraille2;
    window.braille2ToText = braille2ToText;
}

/* 
What do I want to do here? - I want to convert text to English Braille 2 and from Braille 2 to text using this alphabet as a refference -
https://hadleyhelps.org/sites/default/files/2021-03/Braille%20Quick%20Reference.pdf

I will not be including contractions and alphabet wordsigns from this script, as they make accurate translations from Braille 2 
to text impossible. Contraction braille symbols overlap with letter symbols, so it's impossible for the machine to distinquish between them
and accurately translate text from Braille 2 to english if contractions are included. Also some Grade 2 Contractions require a text 
understanding that a machine can't have. For example, the combination wh can be replaced by one character in grade 2, but not when 
the word is combined of two words. So a(wh)ile is OK, but ra(wh)ide is not. 

More specifically, my code will do this:
- Convert lowercase letters to Braille 
- Convert uppercase letters to Braille (including both when only the first letter is uppercase or the entire word)
- Convert numbers to Braille
- Convert punctuation and symbols to Braille
- Convert mixed character words to Braille (for example ASas^&12)
- Accurately convert Braille text with all of the above back into regular English

Outstanding issues with the script: 
* The script is not able to convert Braille punctuation signs back to text as it interprets those braille symbols as letters instead. 
Not sure if there's any way to fix the above issue, given just Braille, I can not determine if the symbol is a punctuation sign or a letter.

Overall, the script should be quite reliable for most actual use cases. 

Also, I currently use UpperCase objects to handle converting text to upper case but I could just use the toUpperCase() method instead. 
That would be cleaner and more efficient.

*/