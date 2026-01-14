import { ENCODING_CONFIGS } from "./config.js";

// UI utility functions
export class UIUtils {
  // Update element content
  static updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Update labels based on conversion type
  static updateLabelsForConversionType(encodingsInterface) {
    const config = ENCODING_CONFIGS[encodingsInterface.currentEncoding];
    if (!config || !config.showConversionType) {
      // Handle simple encodings like Morse (no conversion type selector)
      if (encodingsInterface.currentEncoding === "morse") {
        this.updateElement("input-label", "Text Input");
        this.updateElement("output-label", "Morse Code Output");
        this.updateElement("encode-btn-text", "Text → Morse");
        this.updateElement("decode-btn-text", "Morse → Text");
      }
      return;
    }

    const conversionType = encodingsInterface.currentConversionType;
    const encoding = encodingsInterface.currentEncoding;

    if (encoding === "braille") {
      this.updateElement("input-label", config.labels.input);
      this.updateElement("encode-btn-text", config.labels.encodeBtn);
      this.updateElement("output-label", "Braille Output"); // ← Add this

      if (conversionType === "braille2_contractions") {
        this.updateElement(
          "decode-btn-text",
          config.labels.decodeBtn.contractions
        );
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = true;
          encodedOutput.placeholder = config.placeholders.output.contractions;
        }
      } else {
        this.updateElement("decode-btn-text", config.labels.decodeBtn.default);
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = false;
        }
      }
    } else {
      const isNumber = conversionType === "number";
      const typeKey = isNumber ? "number" : "text";

      if (encoding === "binary" || encoding === "hex") {
        this.updateElement("input-label", config.labels[typeKey].input);
        this.updateElement("encode-btn-text", config.labels[typeKey].encodeBtn);
        this.updateElement("decode-btn-text", config.labels[typeKey].decodeBtn);

        // ← Add output label updates
        if (encoding === "binary") {
          this.updateElement(
            "output-label",
            isNumber ? "Binary Output" : "Binary Output"
          );
        } else if (encoding === "hex") {
          this.updateElement(
            "output-label",
            isNumber ? "Hexadecimal Output" : "Hexadecimal Output"
          );
        }
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
    const config = ENCODING_CONFIGS[encoding];

    if (!config) return;

    if (encoding === "morse") {
      textInput.placeholder = config.placeholders.input;
      encodedOutput.placeholder = config.placeholders.output;
    } else if (encoding === "binary" || encoding === "hex") {
      const typeKey = conversionType === "number" ? "number" : "text";
      textInput.placeholder = config.placeholders[typeKey].input;
      encodedOutput.placeholder = config.placeholders[typeKey].output;
    } else if (encoding === "braille") {
      textInput.placeholder = config.placeholders.input;
      if (conversionType === "braille2_contractions") {
        encodedOutput.placeholder = config.placeholders.output.contractions;
      } else {
        encodedOutput.placeholder = config.placeholders.output.default;
      }
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
      const uiConfig = ENCODING_CONFIGS.ui;
      return navigator.clipboard
        .writeText(encodedOutput.value)
        .then(() => {
          const copyBtn = document.getElementById("copy-result");
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = uiConfig.copyButton.copied;
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, uiConfig.copyButton.copiedTimeout);
          }
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        }); 
    }
    return Promise.resolve();
  }
}
