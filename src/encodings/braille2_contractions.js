// Braille 2 with Contractions converter with unique function names
// Based on braille2 contractions.js but with namespaced functions

// Braille grade 2 dictionaries
const lowerCaseBrailleContractions = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', 
};

const wordSignBrailleContractions = {
  'but': '⠃', 'can': '⠉', 'do': '⠙', 'every': '⠑', 'from': '⠋', 'go': '⠛', 'have': '⠓',
  'just': '⠚', 'knowledge': '⠅', 'like': '⠇', 'more': '⠍', 'not': '⠝', 'people': '⠏', 'quite': '⠟',
  'rather': '⠗', 'so': '⠎', 'that': '⠞', 'us': '⠥', 'very': '⠧', 'will': '⠺', 'it': '⠭', 'you': '⠽',
  'as': '⠵'
};

const shortFormBrailleContractions = {
  'about': '⠁⠃', 'above': '⠁⠃⠧', 'according': '⠁⠉', 'across': '⠁⠉⠗', 'after': '⠁⠋', 'afternoon': '⠁⠋⠝',
  'afterward': '⠁⠋⠺', 'again': '⠁⠛', 'against': '⠁⠛⠌', 'almost': '⠁⠇⠍', 'already': '⠁⠇⠗', 'also': '⠁⠇',
  'although': '⠁⠇⠹', 'altogether': '⠁⠇⠞', 'always': '⠁⠇⠺', 'before': '⠃⠋', 'behind': '⠃⠓', 'below': '⠃⠇',
  'beneath': '⠃⠝', 'beside': '⠃⠎', 'between': '⠃⠞', 'beyond': '⠃⠽', 'blind': '⠃⠇', 'braille': '⠃⠗⠇',
  'children': '⠡⠝', 'conceive': '⠒⠉⠧', 'conceiving': '⠒⠉⠧⠛', 'could': '⠉⠙', 'deceive': '⠙⠉⠧',
  'deceiving': '⠙⠉⠧⠛', 'declare': '⠙⠉⠇', 'declaring': '⠙⠉⠇⠛', 'either': '⠑⠊', 'friend': '⠋⠗',
  'first': '⠋⠌', 'good': '⠛⠙', 'great': '⠛⠗⠞', 'herself': '⠓⠻⠋', 'himself': '⠓⠍⠋', 'immediate': '⠊⠍⠍',
  'little': '⠇⠇', 'letter': '⠇⠗', 'myself': '⠍⠽⠋', 'much': '⠍⠡', 'must': '⠍⠌', 'necessary': '⠝⠑⠉',
  'neither': '⠝⠑⠊', 'paid': '⠏⠙', 'perceive': '⠏⠻⠉', 'perhaps': '⠏⠻⠓', 'quick': '⠟⠅', 'receive': '⠗⠉⠧',
  'receiving': '⠗⠉⠧⠛', 'rejoice': '⠗⠚⠉', 'rejoicing': '⠗⠚⠉⠛', 'said': '⠎⠙', 'should': '⠩⠙',
  'such': '⠎⠡', 'themselves': '⠮⠍⠎', 'together': '⠞⠛⠗', 'tomorrow': '⠞⠍', 'today': '⠞⠙', 'tonight': '⠞⠝',
  'would': '⠺⠙', 'your': '⠽⠗', 'yourself': '⠽⠗⠋', 'yourselves': '⠽⠗⠧⠎'
};

const initialLetterBrailleContractions = {
  'day': '⠐⠙', 'ever': '⠐⠑', 'father': '⠐⠋', 'here': '⠐⠓', 'know': '⠐⠅', 'lord': '⠐⠇', 
  'mother': '⠐⠍', 'name': '⠐⠝', 'one': '⠐⠕', 'part': '⠐⠏', 'question': '⠐⠟', 'right': '⠐⠗',
  'some': '⠐⠎', 'time': '⠐⠞', 'under': '⠐⠥', 'work': '⠐⠺', 'young': '⠐⠽',
  'upon': '⠨⠥', 'these': '⠨⠮', 'those': '⠨⠹', 'whose': '⠨⠱', 'where': '⠨⠺', 'through': '⠨⠹',
  'character': '⠸⠉', 'ought': '⠸⠕', 'there': '⠸⠮', 'were': '⠸⠺'
};

const punctuationSpecialSymbolsBrailleContractions = {
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠦', '!': '⠖', '"': '⠶', '(': '⠐⠣', ')': '⠐⠜', '[': '⠶⠣', ']': '⠶⠜',
  '/': '⠸⠌', '\\': '⠸⠡', '-': '⠤', '_': '⠨⠤', '@': '⠈⠁', '#': '⠨⠼', '$': '⠈⠎', '%': '⠨⠴', '&': '⠈⠯', '*': '⠐⠔', 
'+': '⠐⠖', '=': '⠐⠶', '<': '⠈⠣', '>': '⠈⠜', '^': '⠈⠢', '~': '⠈⠔', '`': '⠈⠑', '|': '⠸⠳','{': '⠸⠣', '}': '⠸⠜'
}

const numberBrailleContractions = {
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
};

// Combined Braille code dictionaries
const allBrailleContractions = Object.assign({}, wordSignBrailleContractions, shortFormBrailleContractions, initialLetterBrailleContractions, lowerCaseBrailleContractions, punctuationSpecialSymbolsBrailleContractions, numberBrailleContractions);
const lettersContractionsBrailleContractions = Object.assign({}, wordSignBrailleContractions, shortFormBrailleContractions, initialLetterBrailleContractions, lowerCaseBrailleContractions);

// Function to convert text to Braille code with contractions
function textToBrailleContractions(text) {
  const words = text.split(' ');
  return words.map(word => convertWordToBrailleContractions(word)).join('⠀');
}

function convertWordToBrailleContractions(word) {
  if (containsMixedCharactersContractions(word)) {
    return convertMixedCharactersContractions(word);
  } else if (/[a-z]/.test(word[0])) {
    return convertLowerCaseContractions(word);
  } else if (/[A-Z]/.test(word[0])) {
    return convertUpperCaseContractions(word);
  } else if (/\d/.test(word[0])) {
    return convertNumbersContractions(word);
  } else {
    return convertPunctuationContractions(word);
  }
}

function containsMixedCharactersContractions(word) {
  return (
    word.match(/[a-zA-Z].*[^a-zA-Z]/) ||
    word.match(/[^a-zA-Z].*[a-zA-Z]/) ||
    word.match(/[\d].*[^\d]/) ||
    word.match(/[^\d].*[\d]/)
  );
}

function convertMixedCharactersContractions(word) {
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
  
  for (const [key, value] of Object.entries(allBrailleContractions)) {
    if (result.includes(key)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  
  return result;
}

function convertLowerCaseContractions(word) {
  for (const [key, value] of Object.entries(lettersContractionsBrailleContractions)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertUpperCaseContractions(word) {
  if (/[A-Z]/.test(word[1])) {
    word = '⠠⠠' + word;
  } else {
    word = '⠠' + word;
  } 
  word = word.toLowerCase();
  for (const [key, value] of Object.entries(lettersContractionsBrailleContractions)) {
    word = word.replace(new RegExp(key, 'g'), value);
  }
  return word;
}

function convertNumbersContractions(word) {
  word = '⠼' + word;
  for (const [key, value] of Object.entries(numberBrailleContractions)) {
    if (word.includes(key)) {
      word = word.replace(new RegExp(key, 'g'), value);
    }
  }
  return word;
}

function convertPunctuationContractions(word) {
  for (const [key, value] of Object.entries(punctuationSpecialSymbolsBrailleContractions)) {
    if (word.includes(key)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      word = word.replace(new RegExp(escapedKey, 'g'), value);
    }
  }
  return word;
}

// Universal module definition
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        textToBrailleContractions
    };
} else {
    window.textToBrailleContractions = textToBrailleContractions;
}