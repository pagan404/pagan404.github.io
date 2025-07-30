// Small script to convert text to braille and back

// Braille grade 2 dictionaries
const lowerCaseBraille = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', 
};

const wordSignBraille = {
  'but': '⠃', 'can': '⠉', 'do': '⠙', 'every': '⠑', 'from': '⠋', 'go': '⠛', 'have': '⠓',
  'just': '⠚', 'knowledge': '⠅', 'like': '⠇', 'more': '⠍', 'not': '⠝', 'people': '⠏', 'quite': '⠟',
  'rather': '⠗', 'so': '⠎', 'that': '⠞', 'us': '⠥', 'very': '⠧', 'will': '⠺', 'it': '⠭', 'you': '⠽',
  'as': '⠵'
};

const shortFormBraille = {
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

const initialLetterBraille = {
  // dot 5 contractions
  'day': '⠐⠙', 'ever': '⠐⠑', 'father': '⠐⠋', 'here': '⠐⠓', 'know': '⠐⠅', 'lord': '⠐⠇', 
  'mother': '⠐⠍', 'name': '⠐⠝', 'one': '⠐⠕', 'part': '⠐⠏', 'question': '⠐⠟', 'right': '⠐⠗',
  'some': '⠐⠎', 'time': '⠐⠞', 'under': '⠐⠥', 'work': '⠐⠺', 'young': '⠐⠽',
  
  // dot 45 contractions
  'upon': '⠨⠥', 'these': '⠨⠮', 'those': '⠨⠹', 'whose': '⠨⠱', 'where': '⠨⠺', 'through': '⠨⠹',
  
  // dot 456 contractions
  'character': '⠸⠉', 'ought': '⠸⠕', 'there': '⠸⠮', 'where': '⠸⠺', 'were': '⠸⠺'
};

const punctuationSpecialSymbolsBraille = {
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠦', '!': '⠖', '"': '⠶', '(': '⠐⠣', ')': '⠐⠜', '[': '⠶⠣', ']': '⠶⠜',
  '/': '⠸⠌', '\\': '⠸⠡', '-': '⠤', '_': '⠨⠤', '@': '⠈⠁', '#': '⠨⠼', '$': '⠈⠎', '%': '⠨⠴', '&': '⠈⠯', '*': '⠐⠔', 
'+': '⠐⠖', '=': '⠐⠶', '<': '⠈⠣', '>': '⠈⠜', '^': '⠈⠢', '~': '⠈⠔', '`': '⠈⠑', '|': '⠸⠳','{': '⠸⠣', '}': '⠸⠜'
}

const numberBraille = {
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
};


// Combined Braille code dictionaries

const allBraille = Object.assign({}, wordSignBraille, shortFormBraille, initialLetterBraille, lowerCaseBraille, punctuationSpecialSymbolsBraille, numberBraille);
const lettersContractionsBraille = Object.assign({}, wordSignBraille, shortFormBraille, initialLetterBraille, lowerCaseBraille);


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
  for (const [key, value] of Object.entries(lettersContractionsBraille)) {
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
  for (const [key, value] of Object.entries(lettersContractionsBraille)) {
    word = word.replace(new RegExp(key, 'g'), value);
  } return word;
}

function convertNumbers(word) {
  word = '⠼' + word; // In braille, numbers have to be indicated by '⠠'
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

// Example usage
const text = "LOREM Ipsum asphalt but every more, have conceiving beyond already, ever father know,";
console.log(textToBraille(text));

module.exports = {
  textToBraille
};

/* 
What do I want to do here? - I want to convert text to English Braille 2 and from Braille 2 to text using this alphabet as a referrence -
https://hadleyhelps.org/sites/default/files/2021-03/Braille%20Quick%20Reference.pdf


Outstanding issues with the script: 


New issues with contractions now included:



List of things left to do: 
* Include strong, lower and final letter contractions (these may have special rules when they're used in the 
beginning or end of the word, look into it). 

*/