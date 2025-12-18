// Handles all conversion logic
window.ConversionHandler = class ConversionHandler {
  // Handle text input conversion
  static handleTextInput(encodingsInterface) {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (!textInput || !encodedOutput) return;

    const inputText = textInput.value;
    if (!inputText.trim()) {
      encodedOutput.value = "";
      return;
    }

    try {
      let result = "";
      const encoding = encodingsInterface.currentEncoding;
      const conversionType = encodingsInterface.currentConversionType;

      switch (encoding) {
        case "morse":
          if (typeof window.textToMorse === "function") {
            result = window.textToMorse(inputText);
          }
          break;
        case "binary":
          if (conversionType === "number") {
            const num = parseInt(inputText);
            if (!isNaN(num) && typeof window.decimalToBinary === "function") {
              result = window.decimalToBinary(num);
            }
          } else {
            if (typeof window.textToBinary === "function") {
              result = window.textToBinary(inputText);
            }
          }
          break;
        case "hex":
          if (conversionType === "number") {
            const num = parseInt(inputText);
            if (!isNaN(num) && typeof window.decimalToHex === "function") {
              result = window.decimalToHex(num);
            }
          } else {
            if (typeof window.textToHex === "function") {
              result = window.textToHex(inputText);
            }
          }
          break;
        case "braille":
          switch (conversionType) {
            case "braille1":
              if (typeof window.textToBraille1 === "function") {
                result = window.textToBraille1(inputText);
              }
              break;
            case "braille2":
              if (typeof window.textToBraille2 === "function") {
                result = window.textToBraille2(inputText);
              }
              break;
            case "braille2_contractions":
              if (typeof window.textToBrailleContractions === "function") {
                result = window.textToBrailleContractions(inputText);
              }
              break;
          }
          break;
      }

      encodedOutput.value = result;
    } catch (error) {
      console.error("Encoding error:", error);
      encodedOutput.value = "Error: " + error.message;
    }
  }

  // Handle encoded input conversion
  static handleEncodedInput(encodingsInterface) {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (!textInput || !encodedOutput) return;

    const encoding = encodingsInterface.currentEncoding;
    const conversionType = encodingsInterface.currentConversionType;

    // Don't allow reverse conversion for Braille contractions
    if (encoding === "braille" && conversionType === "braille2_contractions") {
      return;
    }

    const encodedText = encodedOutput.value;
    if (!encodedText.trim()) {
      textInput.value = "";
      return;
    }

    try {
      let result = "";

      switch (encoding) {
        case "morse":
          if (typeof window.morseToText === "function") {
            result = window.morseToText(encodedText);
          }
          break;
        case "binary":
          if (conversionType === "number") {
            if (typeof window.binaryToDecimal === "function") {
              result = window.binaryToDecimal(encodedText);
            }
          } else {
            if (typeof window.binaryToText === "function") {
              result = window.binaryToText(encodedText);
            }
          }
          break;
        case "hex":
          if (conversionType === "number") {
            if (typeof window.hexToDecimal === "function") {
              result = window.hexToDecimal(encodedText);
            }
          } else {
            if (typeof window.hexToText === "function") {
              result = window.hexToText(encodedText);
            }
          }
          break;
        case "braille":
          switch (conversionType) {
            case "braille1":
              if (typeof window.braille1ToText === "function") {
                result = window.braille1ToText(encodedText);
              }
              break;
            case "braille2":
              if (typeof window.braille2ToText === "function") {
                result = window.braille2ToText(encodedText);
              }
              break;
          }
          break;
      }

      textInput.value = result;
    } catch (error) {
      console.error("Decoding error:", error);
      textInput.value = "Error: " + error.message;
    }
  }
};
