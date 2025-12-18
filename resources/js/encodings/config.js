// Configuration for all encoding types
window.ENCODING_CONFIGS = {
  morse: {
    title: "Morse Code Converter",
    description:
      "Convert text to Morse code and back. Type in either field for real-time conversion.",
    inputLabel: "Text Input",
    outputLabel: "Morse Code Output",
    encodeBtn: "Text → Morse",
    decodeBtn: "Morse → Text",
    helpText:
      "Enter text in the left box to see Morse code, or enter Morse code in the right box to see text. Use dots (.) and dashes (-) separated by spaces for Morse code input.",
    showConversionType: false,
  },
  binary: {
    title: "Binary Converter",
    description:
      "Convert numbers or text to binary and back. Choose your conversion type above.",
    inputLabel: "Input",
    outputLabel: "Binary Output",
    encodeBtn: "Convert → Binary",
    decodeBtn: "Binary → Convert",
    helpText:
      "Choose between Numbers or Text mode above. For numbers: enter decimal values. For text: enter any text to convert to binary.",
    showConversionType: true,
  },
  braille: {
    title: "Braille Converter",
    description:
      "Convert text to Braille patterns. Choose your Braille format above.",
    inputLabel: "Text Input",
    outputLabel: "Braille Output",
    encodeBtn: "Text → Braille",
    decodeBtn: "Braille → Text",
    helpText:
      "Choose between Braille 1, Braille 2, or Braille 2 with Contractions above. Enter text to convert to Braille patterns.",
    showConversionType: true,
  },
  hex: {
    title: "Hexadecimal Converter",
    description:
      "Convert numbers or text to hexadecimal and back. Choose your conversion type above.",
    inputLabel: "Input",
    outputLabel: "Hexadecimal Output",
    encodeBtn: "Convert → Hex",
    decodeBtn: "Hex → Convert",
    helpText:
      "Choose between Numbers or Text mode above. For numbers: enter decimal values. For text: enter any text to convert to hexadecimal.",
    showConversionType: true,
  },
};
