// Small script to convert text to braille and back

// Braille grade 2 dictionaries
const lettersBraille = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', 
};

const punctuationSpecialSymbolsBraille = {
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠦', '!': '⠖', '"': '⠶', '(': '⠐⠣', ')': '⠐⠜', '[': '⠶⠣', ']': '⠶⠜',
  '/': '⠸⠌', '\\': '⠸⠡', '-': '⠤', '_': '⠨⠤', '@': '⠈⠁', '#': '⠨⠼', '$': '⠈⠎', '%': '⠨⠴', '&': '⠈⠯', '*': '⠐⠔', 
  '+': '⠐⠖', '=': '⠐⠶', '<': '⠈⠣', '>': '⠈⠜', '^': '⠈⠢', '~': '⠈⠔', '`': '⠈⠑', '|': '⠸⠳','{': '⠸⠣', '}': '⠸⠜'
}

const numberBraille = {
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
};

// Reverse Braille code dictionaries
  const brailleLetters = Object.entries(lettersBraille).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {}
);

const braillePunctuationSpecialSymbols = Object.entries(punctuationSpecialSymbolsBraille).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {}
);

const brailleNumbers = Object.entries(numberBraille).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {}
);

// Combined Braille code dictionaries

const allBraille = Object.assign({}, lettersBraille, punctuationSpecialSymbolsBraille, numberBraille);
const brailleAll = Object.assign({}, brailleLetters, braillePunctuationSpecialSymbols);

// Function to convert text to Braille code
function textToBraille(text) {
  const words = text.split(' ');
  return words.map(word => convertWordToBraille(word)).join('⠀'); // I'm joining them together with a space character of Braille in between the words.
}

function convertWordToBraille(word) {
  if (containsMixedCharacters(word)) {
    return convertMixedCharacters(word);
  } else if (/[a-z]/.test(word[0])) {
    return convertLowerCase(word);
  } else if (/[A-Z]/.test(word[0])) {
    return convertUpperCase(word);
  } else if (/\d/.test(word[0])) {
    return convertNumbers(word);
  } else {
    return convertPunctuation(word);
  }
}

function containsMixedCharacters(word) {
  return (
    word.match(/[a-zA-Z].*[^a-zA-Z]/) ||
    word.match(/[^a-zA-Z].*[a-zA-Z]/) ||
    word.match(/[\d].*[^\d]/) ||
    word.match(/[^\d].*[\d]/)
  );
}

function convertMixedCharacters(word) {
  // Handle capital letter first (if present)
  if (/[A-Z]/.test(word[0])) {
    word = '⠠' + word.toLowerCase(); // In braille, capital letters have to be indicated by '⠠'
  }
  
  // Insert numeric indicator before numbers
  let result = '';
  let inNumberMode = false;
  
  // Process character by character
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    
    // Check if current character is a number
    if (/\d/.test(char)) {
      // Add numeric indicator if we're not already in number mode
      if (!inNumberMode) {
        result += '⠼';
        inNumberMode = true;
      }
    } else {
      // Exit number mode when encountering non-digit
      inNumberMode = false;
    }
    
    result += char;
  }
  
  // Now replace all characters with their Braille equivalents
  for (const [key, value] of Object.entries(allBraille)) {
    if (result.includes(key)) {
      // Escape special regex characters before creating RegExp
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  
  return result;
}

function convertLowerCase(word) {
  for (const [key, value] of Object.entries(lettersBraille)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertUpperCase(word) {
  if (/[A-Z]/.test(word[1])) {
    word = '⠠⠠' + word; // In braille, all caps letters have to be indicated by '⠠⠠'
  } else {
    word = '⠠' + word; // In braille, capital letters have to be indicated by '⠠'
  } 
  word = word.toLowerCase();
  for (const [key, value] of Object.entries(lettersBraille)) {
    word = word.replace(new RegExp(key, 'g'), value);
  } return word;
}

function convertNumbers(word) {
  word = '⠼' + word; // In braille, numbers have to be indicated by '⠼'
  for (const [key, value] of Object.entries(numberBraille)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertPunctuation(word) {
  for (const [key, value] of Object.entries(punctuationSpecialSymbolsBraille)) {
    if (word.includes(key)) {
      // Escape special regex characters before creating RegExp
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      word = word.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  return word;
}

// Function to convert Braille code to text
function brailleToText(braille) {
  const words = braille.split('⠀');
  return words.map(word => {
    if (word[0] === '⠼') {
      return convertBrailleNumber(word);
    } else if (word[0] === '⠠') {
      return convertBrailleUpperCase(word);
    } else {
      return convertBrailleGeneral(word);
    }
  }).join(' ');
}

function convertBrailleNumber(word) {
  word = word.slice(1);
  for (const [key, value] of Object.entries(brailleNumbers)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertBrailleUpperCase(word) {
  if (word[1] === '⠠') {
    // All caps case
    word = word.slice(2);
    
    // Check for numeric indicator in the word
    const hasNumberIndicator = word.includes('⠼');
    
    // Remove numeric indicators before processing
    let processedWord = word.replace(/⠼/g, '');
    
    // Process numbers and letters
    if (hasNumberIndicator) {
      // Handle numbers first
      for (const [key, value] of Object.entries(brailleNumbers)) {
        if (processedWord.includes(key)) {
          processedWord = processedWord.replace(new RegExp(key, 'g'), value);
        }
      }
    }
    
    // Handle all other characters
    for (const [key, value] of Object.entries(brailleAll)) {
      if (processedWord.includes(key)) {
        processedWord = processedWord.replace(new RegExp(key, 'g'), value);
      }
    }
    
    return processedWord.toUpperCase();
  } else {
    // First letter capitalized
    word = word.slice(1);
    
    // Check for numeric indicator
    const hasNumberIndicator = word.includes('⠼');
    if (hasNumberIndicator) {
      // This word has numbers - need to handle specially
      word = word.replace(/⠼/g, ''); // Remove numeric indicators
      
      // Get first character and make uppercase
      const firstChar = word[0];
      let upperFirst = brailleAll[firstChar];
      if (upperFirst) {
        upperFirst = upperFirst.toUpperCase();
      } else {
        // If first char is a number, don't capitalize
        upperFirst = brailleNumbers[firstChar] || firstChar;
      }
      
      const restOfWord = word.slice(1);
      let translatedRest = restOfWord;
      
      // Process numbers in the rest of the word
      for (const [key, value] of Object.entries(brailleNumbers)) {
        if (translatedRest.includes(key)) {
          translatedRest = translatedRest.replace(new RegExp(key, 'g'), value);
        }
      }
      
      // Process other characters
      for (const [key, value] of Object.entries(brailleAll)) {
        if (translatedRest.includes(key)) {
          translatedRest = translatedRest.replace(new RegExp(key, 'g'), value);
        }
      }
      
      return upperFirst + translatedRest;
    } else {
      // Original implementation for word without numbers
      const firstChar = word[0];
      const upperFirst = brailleAll[firstChar].toUpperCase();
      const restOfWord = word.slice(1);
      let translatedRest = restOfWord;
      
      for (const [key, value] of Object.entries(brailleAll)) { 
        translatedRest = translatedRest.replace(new RegExp(key, 'g'), value);
      }
      
      return upperFirst + translatedRest;
    }
  }
}

function convertBrailleGeneral(word) {
  // Check if the word contains a numeric indicator
  const hasNumberIndicator = word.includes('⠼');
  
  // Remove the numeric indicator(s) before processing
  word = word.replace(/⠼/g, '');
  
  if (hasNumberIndicator) {
    // Use the numbers-aware dictionary for the entire word
    for (const [key, value] of Object.entries(brailleNumbers)) {
      if (word.includes(key)) {
        word = word.replace(new RegExp(key, 'g'), value);
      }
    }
    
    // Process any remaining characters with the regular dictionary
    for (const [key, value] of Object.entries(brailleAll)) {
      if (word.includes(key)) {
        word = word.replace(new RegExp(key, 'g'), value);
      }
    }
  } else {
    // No numeric indicator, use regular dictionary
    for (const [key, value] of Object.entries(brailleAll)) {
      if (word.includes(key)) {
        word = word.replace(new RegExp(key, 'g'), value);
      }
    }
  }
  
  return word;
}

module.exports = {
  textToBraille,
  brailleToText
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