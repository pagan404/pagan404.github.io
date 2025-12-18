// Main encodings interface controller
class EncodingsInterface {
  constructor() {
    this.currentEncoding = "morse";
    this.currentConversionType = "number";
  }

  // Initialize the converter
  init() {
    this.setupEventListeners();
    window.DropdownManager.setupEncodingDropdown(this);
    window.DropdownManager.setupConversionDropdown(this);
    this.updateInterface();
  }

  // Set up all event listeners
  setupEventListeners() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (textInput) {
      textInput.addEventListener("input", () =>
        window.ConversionHandler.handleTextInput(this)
      );
    }

    if (encodedOutput) {
      encodedOutput.addEventListener("input", () =>
        window.ConversionHandler.handleEncodedInput(this)
      );
    }

    // Button listeners
    const textToEncodedBtn = document.getElementById("text-to-encoded");
    const encodedToTextBtn = document.getElementById("encoded-to-text");
    const clearBtn = document.getElementById("clear-all");
    const copyBtn = document.getElementById("copy-result");

    if (textToEncodedBtn) {
      textToEncodedBtn.addEventListener("click", () =>
        window.ConversionHandler.handleTextInput(this)
      );
    }

    if (encodedToTextBtn) {
      encodedToTextBtn.addEventListener("click", () =>
        this.convertEncodedToText()
      );
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => window.UIUtils.clearFields());
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => window.UIUtils.copyResult());
    }
  }

  // Update the interface based on selected encoding
  updateInterface() {
    const config = window.ENCODING_CONFIGS[this.currentEncoding];
    if (!config) return;

    // Update title and description
    window.UIUtils.updateElement("converter-title", config.title);
    window.UIUtils.updateElement("converter-description", config.description);
    window.UIUtils.updateElement("help-text", config.helpText);
    window.UIUtils.updateElement("input-label", config.inputLabel);
    window.UIUtils.updateElement("output-label", config.outputLabel);
    window.UIUtils.updateElement("encode-btn-text", config.encodeBtn);
    window.UIUtils.updateElement("decode-btn-text", config.decodeBtn);

    // Show/hide conversion type selector
    const conversionTypeContainer = document.getElementById(
      "conversion-type-container"
    );
    const conversionTypeSelector = document.getElementById(
      "conversion-type-dropdown"
    );

    if (conversionTypeContainer && conversionTypeSelector) {
      if (config.showConversionType) {
        conversionTypeContainer.style.display = "block";
        window.DropdownManager.updateConversionTypeOptions(this);
        this.updateLabelsForConversionType();
      } else {
        conversionTypeContainer.style.display = "none";
      }
    }

    window.UIUtils.updatePlaceholders(this);
  }

  // Proxy methods to UIUtils
  updateLabelsForConversionType() {
    window.UIUtils.updateLabelsForConversionType(this);
  }

  clearFields() {
    window.UIUtils.clearFields();
  }

  // Convert encoded format to text with validation
  convertEncodedToText() {
    if (
      this.currentEncoding === "braille" &&
      this.currentConversionType === "braille2_contractions"
    ) {
      alert(
        "Braille with contractions cannot be converted back to text accurately. This is a one-way conversion only."
      );
      return;
    }
    window.ConversionHandler.handleEncodedInput(this);
  }
}

// Make the class globally available
window.EncodingsInterface = EncodingsInterface;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const encodingsInterface = new EncodingsInterface();
  encodingsInterface.init();
  window.encodingsInterface = encodingsInterface;
});
