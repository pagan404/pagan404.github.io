import {
  getEncoder,
  getDecoder,
  supportsDecoding,
} from "../../../src/encodings/index.js";

// Handles all conversion logic
export class ConversionHandler {
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
      const encoding = encodingsInterface.currentEncoding;
      const conversionType = encodingsInterface.currentConversionType;

      // Validate input length to prevent DoS
      if (inputText.length > 500) {
        throw new Error("Input too large (max 500 characters)");
      }

      // Special handling for number conversions
      if (conversionType === "number") {
        const num = parseInt(inputText);
        if (isNaN(num)) {
          throw new Error("Invalid number input");
        }
      }

      const encoder = getEncoder(encoding, conversionType);
      const result = encoder(inputText);

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

    // Check if reverse conversion is supported
    if (!supportsDecoding(encoding, conversionType)) {
      return;
    }

    const encodedText = encodedOutput.value;
    if (!encodedText.trim()) {
      textInput.value = "";
      return;
    }

    try {
      // Validate input length
      if (encodedText.length > 500) {
        throw new Error("Input too large (max 500 characters)");
      }

      const decoder = getDecoder(encoding, conversionType);
      const result = decoder(encodedText);

      textInput.value = result;
    } catch (error) {
      console.error("Decoding error:", error);
      textInput.value = "Error: " + error.message;
    }
  }
}
