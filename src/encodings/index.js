// Import all encoding functions
import { textToMorse, morseToText } from './morse.js';
import { textToBinary, binaryToText, decimalToBinary, binaryToDecimal } from './binary.js';
import { textToHex, hexToText, decimalToHex, hexToDecimal } from './hexidecimal.js';
import { textToBraille, brailleToText } from './braille1.js';
import { textToBraille2, braille2ToText } from './braille2.js';
import { textToBrailleContractions } from './braille2_contractions.js';

// Registry object mapping encodings to their converters
export const encodingConverters = {
  morse: {
    text: { 
      encode: textToMorse, 
      decode: morseToText 
    }
  },
  
  binary: {
    text: { 
      encode: textToBinary, 
      decode: binaryToText 
    },
    number: { 
      encode: decimalToBinary, 
      decode: binaryToDecimal 
    }
  },
  
  hex: {
    text: { 
      encode: textToHex, 
      decode: hexToText 
    },
    number: { 
      encode: decimalToHex, 
      decode: hexToDecimal 
    }
  },
  
  braille: {
    braille1: { 
      encode: textToBraille, 
      decode: brailleToText 
    },
    braille2: { 
      encode: textToBraille2, 
      decode: braille2ToText 
    },
    braille2_contractions: { 
      encode: textToBrailleContractions, 
      decode: null // No reverse conversion for contractions
    }
  }
};

// Helper function to get a specific converter
export function getConverter(encoding, conversionType = 'text') {
  const encodingGroup = encodingConverters[encoding];
  if (!encodingGroup) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }
  
  const converter = encodingGroup[conversionType];
  if (!converter) {
    throw new Error(`Unknown conversion type '${conversionType}' for encoding '${encoding}'`);
  }
  
  return converter;
}

// Helper function to get encoder
export function getEncoder(encoding, conversionType = 'text') {
  const converter = getConverter(encoding, conversionType);
  if (!converter.encode) {
    throw new Error(`No encoder available for ${encoding}:${conversionType}`);
  }
  return converter.encode;
}

// Helper function to get decoder
export function getDecoder(encoding, conversionType = 'text') {
  const converter = getConverter(encoding, conversionType);
  if (!converter.decode) {
    throw new Error(`No decoder available for ${encoding}:${conversionType}`);
  }
  return converter.decode;
}

// Helper to check if decoding is supported
export function supportsDecoding(encoding, conversionType = 'text') {
  try {
    const converter = getConverter(encoding, conversionType);
    return converter.decode !== null;
  } catch {
    return false;
  }
}

// Export list of available encodings for UI
export const availableEncodings = Object.keys(encodingConverters);

// Export conversion types for each encoding
export const conversionTypes = {
  morse: ['text'],
  binary: ['text', 'number'],
  hex: ['text', 'number'],
  braille: ['braille1', 'braille2', 'braille2_contractions']
};
