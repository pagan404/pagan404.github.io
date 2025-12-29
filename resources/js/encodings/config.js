// Configuration for all encoding types
export const ENCODING_CONFIGS = {
  morse: {
    title: "Morse Code Converter",
    description:
      "Convert text to Morse code and back. Type in either field for real-time conversion.",
    showConversionType: false,
    labels: {
      input: "Text Input",
      encodeBtn: "Text → Morse",
      decodeBtn: "Morse → Text",
    },
    placeholders: {
      input: "Enter your text here...",
      output: "Morse code will appear here...",
    },
  },
  binary: {
    title: "Binary Converter",
    description:
      "Convert numbers or text to binary and back. Choose your conversion type above.",
    showConversionType: true,
    labels: {
      text: {
        input: "Text Input",
        encodeBtn: "Text → Binary",
        decodeBtn: "Binary → Text",
      },
      number: {
        input: "Decimal Number",
        encodeBtn: "Decimal → Binary",
        decodeBtn: "Binary → Decimal",
      },
    },
    placeholders: {
      text: {
        input: "Enter text to convert...",
        output: "Binary will appear here...",
      },
      number: {
        input: "Enter decimal number (e.g., 42)...",
        output: "Binary will appear here...",
      },
    },
  },
  braille: {
    title: "Braille Converter",
    description:
      "Convert text to Braille patterns. Choose your Braille format above.",
    showConversionType: true,
    labels: {
      input: "Text Input",
      encodeBtn: "Text → Braille",
      decodeBtn: {
        default: "Braille → Text",
        contractions: "One-way only",
      },
    },
    placeholders: {
      input: "Enter text to convert to Braille...",
      output: {
        default: "Braille patterns will appear here...",
        contractions: "Braille with contractions (one-way conversion only)",
      },
    },
  },
  hex: {
    title: "Hexadecimal Converter",
    description:
      "Convert numbers or text to hexadecimal and back. Choose your conversion type above.",
    showConversionType: true,
    labels: {
      text: {
        input: "Text Input",
        encodeBtn: "Text → Hex",
        decodeBtn: "Hex → Text",
      },
      number: {
        input: "Decimal Number",
        encodeBtn: "Decimal → Hex",
        decodeBtn: "Hex → Decimal",
      },
    },
    placeholders: {
      text: {
        input: "Enter text to convert...",
        output: "Hexadecimal will appear here...",
      },
      number: {
        input: "Enter decimal number (e.g., 255)...",
        output: "Hexadecimal will appear here...",
      },
    },
  },
  ui: {
    copyButton: {
      default: "Copy",
      copied: "Copied!",
      copiedTimeout: 2000,
    },
  },
};
