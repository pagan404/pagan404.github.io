// UI utility functions
window.UIUtils = class UIUtils {
  // Update element content
  static updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Update labels based on conversion type
  static updateLabelsForConversionType(encodingsInterface) {
    const config = window.ENCODING_CONFIGS[encodingsInterface.currentEncoding];
    if (!config || !config.showConversionType) return;

    const conversionType = encodingsInterface.currentConversionType;
    const encoding = encodingsInterface.currentEncoding;

    if (encoding === "braille") {
      this.updateElement("input-label", "Text Input");
      this.updateElement("encode-btn-text", "Text → Braille");

      if (conversionType === "braille2_contractions") {
        this.updateElement("decode-btn-text", "One-way only");
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = true;
          encodedOutput.placeholder =
            "Braille with contractions (one-way conversion only)";
        }
      } else {
        this.updateElement("decode-btn-text", "Braille → Text");
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = false;
        }
      }
    } else {
      const isNumber = conversionType === "number";

      if (encoding === "binary") {
        this.updateElement(
          "input-label",
          isNumber ? "Decimal Number" : "Text Input"
        );
        this.updateElement(
          "encode-btn-text",
          isNumber ? "Decimal → Binary" : "Text → Binary"
        );
        this.updateElement(
          "decode-btn-text",
          isNumber ? "Binary → Decimal" : "Binary → Text"
        );
      } else if (encoding === "hex") {
        this.updateElement(
          "input-label",
          isNumber ? "Decimal Number" : "Text Input"
        );
        this.updateElement(
          "encode-btn-text",
          isNumber ? "Decimal → Hex" : "Text → Hex"
        );
        this.updateElement(
          "decode-btn-text",
          isNumber ? "Hex → Decimal" : "Hex → Text"
        );
      }

      const encodedOutput = document.getElementById("encoded-output");
      if (encodedOutput) {
        encodedOutput.disabled = false;
      }
    }

    this.updatePlaceholders(encodingsInterface);
  }

  // Update placeholders
  static updatePlaceholders(encodingsInterface) {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (!textInput || !encodedOutput) return;

    const encoding = encodingsInterface.currentEncoding;
    const conversionType = encodingsInterface.currentConversionType;

    switch (encoding) {
      case "morse":
        textInput.placeholder = "Enter your text here...";
        encodedOutput.placeholder = "Morse code will appear here...";
        break;
      case "binary":
        if (conversionType === "number") {
          textInput.placeholder = "Enter decimal number (e.g., 42)...";
          encodedOutput.placeholder = "Binary will appear here...";
        } else {
          textInput.placeholder = "Enter text to convert...";
          encodedOutput.placeholder = "Binary will appear here...";
        }
        break;
      case "hex":
        if (conversionType === "number") {
          textInput.placeholder = "Enter decimal number (e.g., 255)...";
          encodedOutput.placeholder = "Hexadecimal will appear here...";
        } else {
          textInput.placeholder = "Enter text to convert...";
          encodedOutput.placeholder = "Hexadecimal will appear here...";
        }
        break;
      case "braille":
        textInput.placeholder = "Enter text to convert to Braille...";
        if (conversionType === "braille2_contractions") {
          encodedOutput.placeholder =
            "Braille with contractions (one-way conversion only)";
        } else {
          encodedOutput.placeholder = "Braille patterns will appear here...";
        }
        break;
    }
  }

  // Clear all fields
  static clearFields() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (textInput) textInput.value = "";
    if (encodedOutput) encodedOutput.value = "";
  }

  // Copy result to clipboard
  static copyResult() {
    const encodedOutput = document.getElementById("encoded-output");
    if (encodedOutput && encodedOutput.value) {
      navigator.clipboard
        .writeText(encodedOutput.value)
        .then(() => {
          const copyBtn = document.getElementById("copy-result");
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 2000);
          }
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  }
};
