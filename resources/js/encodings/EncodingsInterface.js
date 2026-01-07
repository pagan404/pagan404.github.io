import { ENCODING_CONFIGS } from "./config.js";
import { ConversionHandler } from "./ConversionHandler.js";
import { DropdownManager } from "./DropdownManager.js";
import { UIUtils } from "./UIUtils.js";

// Main encodings interface controller
export class EncodingsInterface {
  constructor() {
    this.currentEncoding = "morse";
    this.currentConversionType = "text";
  }

  // Initialize the converter
  init() {
    this.setupEventListeners();
    DropdownManager.setupEncodingDropdown(this);
    DropdownManager.setupConversionDropdown(this);
    this.updateInterface();
  }

  // Set up all event listeners
  setupEventListeners() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (textInput) {
      textInput.addEventListener("input", () =>
        ConversionHandler.handleTextInput(this)
      );
    }

    if (encodedOutput) {
      encodedOutput.addEventListener("input", () =>
        ConversionHandler.handleEncodedInput(this)
      );
    }

    // Button listeners
    const textToEncodedBtn = document.getElementById("text-to-encoded");
    const encodedToTextBtn = document.getElementById("encoded-to-text");
    const clearBtn = document.getElementById("clear-all");
    const copyBtn = document.getElementById("copy-result");

    if (textToEncodedBtn) {
      textToEncodedBtn.addEventListener("click", () =>
        ConversionHandler.handleTextInput(this)
      );
    }

    if (encodedToTextBtn) {
      encodedToTextBtn.addEventListener("click", () =>
        this.convertEncodedToText()
      );
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => UIUtils.clearFields());
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => UIUtils.copyResult());
    }
  }

  // Update the interface based on selected encoding
  updateInterface() {
    const config = ENCODING_CONFIGS[this.currentEncoding];
    if (!config) return;

    // Update title and description
    UIUtils.updateElement("converter-title", config.title);
    UIUtils.updateElement("converter-description", config.description);

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
        DropdownManager.updateConversionTypeOptions(this);
      } else {
        conversionTypeContainer.style.display = "none";
      }
    }

    // Always update labels, regardless of showConversionType
    this.updateLabelsForConversionType();

    UIUtils.updatePlaceholders(this);
  }

  // Update labels for conversion type
  updateLabelsForConversionType() {
    UIUtils.updateLabelsForConversionType(this);
  }

  // Clear all fields
  clearFields() {
    UIUtils.clearFields();
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
    ConversionHandler.handleEncodedInput(this);
  }
}
