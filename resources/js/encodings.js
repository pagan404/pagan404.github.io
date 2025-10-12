class EncodingsInterface {
  constructor() {
    this.currentEncoding = "morse";
    this.currentConversionType = "number"; // Default for binary/hex, or braille mode for braille
    this.encodingConfigs = {
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
  }

  // Initialize the converter
  init() {
    this.setupEventListeners();
    this.setupCustomDropdown();
    this.setupConversionDropdown();
    this.updateInterface(); // Set initial interface
  }

  // Set up all event listeners
  setupEventListeners() {
    // Encoding type selector - Remove this since we're using custom dropdown
    // The custom dropdown will directly call this.currentEncoding and this.updateInterface()

    // Conversion type selector - Now using custom dropdown
    // The custom dropdown will directly call this.currentConversionType and this.updateLabelsForConversionType()

    // Input field listeners
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (textInput) {
      textInput.addEventListener("input", () => this.handleTextInput());
    }

    if (encodedOutput) {
      encodedOutput.addEventListener("input", () => this.handleEncodedInput());
    }

    // Button listeners
    const textToEncodedBtn = document.getElementById("text-to-encoded");
    const encodedToTextBtn = document.getElementById("encoded-to-text");
    const clearBtn = document.getElementById("clear-all");
    const copyBtn = document.getElementById("copy-result");

    if (textToEncodedBtn) {
      textToEncodedBtn.addEventListener("click", () =>
        this.convertTextToEncoded()
      );
    }

    if (encodedToTextBtn) {
      encodedToTextBtn.addEventListener("click", () =>
        this.convertEncodedToText()
      );
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearFields());
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyResult());
    }
  }

  // Update the interface based on selected encoding
  updateInterface() {
    const config = this.encodingConfigs[this.currentEncoding];
    if (!config) return;

    // Update title and description
    this.updateElement("converter-title", config.title);
    this.updateElement("converter-description", config.description);
    this.updateElement("help-text", config.helpText);

    // Update labels and buttons
    this.updateElement("input-label", config.inputLabel);
    this.updateElement("output-label", config.outputLabel);
    this.updateElement("encode-btn-text", config.encodeBtn);
    this.updateElement("decode-btn-text", config.decodeBtn);

    // Show/hide conversion type selector and update options
    const conversionTypeContainer = document.getElementById(
      "conversion-type-container"
    );
    const conversionTypeSelector = document.getElementById(
      "conversion-type-dropdown"
    );

    if (conversionTypeContainer && conversionTypeSelector) {
      if (config.showConversionType) {
        conversionTypeContainer.style.display = "block";
        this.updateConversionTypeOptions();
        this.updateLabelsForConversionType();
      } else {
        conversionTypeContainer.style.display = "none";
      }
    }

    // Update placeholders
    this.updatePlaceholders();
  }

  // Update conversion type selector options based on encoding
  updateConversionTypeOptions() {
    const conversionDropdownSelected = document.getElementById(
      "conversion-dropdown-selected"
    );
    const conversionDropdownOptions = document.getElementById(
      "conversion-dropdown-options"
    );

    if (!conversionDropdownSelected || !conversionDropdownOptions) return;

    // Clear existing options
    conversionDropdownOptions.innerHTML = "";

    if (this.currentEncoding === "braille") {
      // Braille-specific options
      const braille1Option = document.createElement("div");
      braille1Option.className = "dropdown-option active";
      braille1Option.setAttribute("data-value", "braille1");
      braille1Option.textContent = "Braille 1";

      const braille2Option = document.createElement("div");
      braille2Option.className = "dropdown-option";
      braille2Option.setAttribute("data-value", "braille2");
      braille2Option.textContent = "Braille 2";

      const braille2ContractionsOption = document.createElement("div");
      braille2ContractionsOption.className = "dropdown-option";
      braille2ContractionsOption.setAttribute(
        "data-value",
        "braille2_contractions"
      );
      braille2ContractionsOption.textContent = "Braille 2 + Contractions";

      conversionDropdownOptions.appendChild(braille1Option);
      conversionDropdownOptions.appendChild(braille2Option);
      conversionDropdownOptions.appendChild(braille2ContractionsOption);

      // Set default to braille1
      this.currentConversionType = "braille1";
      conversionDropdownSelected.querySelector("span").textContent =
        "Braille 1";
    } else {
      // Binary/Hex options
      const numberOption = document.createElement("div");
      numberOption.className = "dropdown-option active";
      numberOption.setAttribute("data-value", "number");
      numberOption.textContent = "Numbers";

      const textOption = document.createElement("div");
      textOption.className = "dropdown-option";
      textOption.setAttribute("data-value", "text");
      textOption.textContent = "Text";

      conversionDropdownOptions.appendChild(numberOption);
      conversionDropdownOptions.appendChild(textOption);

      // Set default to number
      this.currentConversionType = "number";
      conversionDropdownSelected.querySelector("span").textContent = "Numbers";
    }

    // Re-setup the conversion dropdown event listeners for new options
    this.setupConversionDropdown();
  }

  // Update labels based on conversion type for binary/hex/braille
  updateLabelsForConversionType() {
    const config = this.encodingConfigs[this.currentEncoding];
    if (!config || !config.showConversionType) return;

    if (this.currentEncoding === "braille") {
      // Update labels for Braille modes
      this.updateElement("input-label", "Text Input");
      this.updateElement("encode-btn-text", "Text → Braille");

      // Check if contractions mode is selected
      if (this.currentConversionType === "braille2_contractions") {
        this.updateElement("decode-btn-text", "One-way only");
        // Disable the encoded output field for input
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = true;
          encodedOutput.placeholder =
            "Braille with contractions (one-way conversion only)";
        }
      } else {
        this.updateElement("decode-btn-text", "Braille → Text");
        // Enable the encoded output field for input
        const encodedOutput = document.getElementById("encoded-output");
        if (encodedOutput) {
          encodedOutput.disabled = false;
        }
      }
    } else {
      // Binary/Hex mode updates
      const isNumber = this.currentConversionType === "number";

      if (this.currentEncoding === "binary") {
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
      } else if (this.currentEncoding === "hex") {
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

      // Re-enable encoded output for binary/hex
      const encodedOutput = document.getElementById("encoded-output");
      if (encodedOutput) {
        encodedOutput.disabled = false;
      }
    }

    this.updatePlaceholders();
  }

  // Update placeholders based on current mode
  updatePlaceholders() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (!textInput || !encodedOutput) return;

    switch (this.currentEncoding) {
      case "morse":
        textInput.placeholder = "Enter your text here...";
        encodedOutput.placeholder = "Morse code will appear here...";
        break;
      case "binary":
        if (this.currentConversionType === "number") {
          textInput.placeholder = "Enter decimal number (e.g., 42)...";
          encodedOutput.placeholder = "Binary will appear here...";
        } else {
          textInput.placeholder = "Enter text to convert...";
          encodedOutput.placeholder = "Binary will appear here...";
        }
        break;
      case "hex":
        if (this.currentConversionType === "number") {
          textInput.placeholder = "Enter decimal number (e.g., 255)...";
          encodedOutput.placeholder = "Hexadecimal will appear here...";
        } else {
          textInput.placeholder = "Enter text to convert...";
          encodedOutput.placeholder = "Hexadecimal will appear here...";
        }
        break;
      case "braille":
        textInput.placeholder = "Enter text to convert to Braille...";
        if (this.currentConversionType === "braille2_contractions") {
          encodedOutput.placeholder =
            "Braille with contractions (one-way conversion only)";
        } else {
          encodedOutput.placeholder = "Braille patterns will appear here...";
        }
        break;
    }
  }

  // Handle text input conversion
  handleTextInput() {
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

      switch (this.currentEncoding) {
        case "morse":
          if (typeof window.textToMorse === "function") {
            result = window.textToMorse(inputText);
          }
          break;
        case "binary":
          if (this.currentConversionType === "number") {
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
          if (this.currentConversionType === "number") {
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
          // Handle different Braille modes with unique function names
          switch (this.currentConversionType) {
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
  handleEncodedInput() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (!textInput || !encodedOutput) return;

    // Don't allow reverse conversion for Braille contractions
    if (
      this.currentEncoding === "braille" &&
      this.currentConversionType === "braille2_contractions"
    ) {
      return;
    }

    const encodedText = encodedOutput.value;
    if (!encodedText.trim()) {
      textInput.value = "";
      return;
    }

    try {
      let result = "";

      switch (this.currentEncoding) {
        case "morse":
          if (typeof window.morseToText === "function") {
            result = window.morseToText(encodedText);
          }
          break;
        case "binary":
          if (this.currentConversionType === "number") {
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
          if (this.currentConversionType === "number") {
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
          // Handle reverse Braille conversion with unique function names
          switch (this.currentConversionType) {
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
            // braille2_contractions has no reverse function (one-way only)
          }
          break;
      }

      textInput.value = result;
    } catch (error) {
      console.error("Decoding error:", error);
      textInput.value = "Error: " + error.message;
    }
  }

  // Convert text to encoded format
  convertTextToEncoded() {
    this.handleTextInput();
  }

  // Convert encoded format to text
  convertEncodedToText() {
    // Don't allow reverse conversion for Braille contractions
    if (
      this.currentEncoding === "braille" &&
      this.currentConversionType === "braille2_contractions"
    ) {
      alert(
        "Braille with contractions cannot be converted back to text accurately. This is a one-way conversion only."
      );
      return;
    }
    this.handleEncodedInput();
  }

  // Clear all input fields
  clearFields() {
    const textInput = document.getElementById("text-input");
    const encodedOutput = document.getElementById("encoded-output");

    if (textInput) textInput.value = "";
    if (encodedOutput) encodedOutput.value = "";
  }

  // Copy result to clipboard
  copyResult() {
    const encodedOutput = document.getElementById("encoded-output");
    if (encodedOutput && encodedOutput.value) {
      navigator.clipboard
        .writeText(encodedOutput.value)
        .then(() => {
          // Visual feedback
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

  // Utility method to update element content
  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Setup custom dropdown functionality
  setupCustomDropdown() {
    const dropdown = document.getElementById("encoding-dropdown");
    const dropdownSelected = document.getElementById("dropdown-selected");
    const dropdownOptions = document.getElementById("dropdown-options");
    const options = document.querySelectorAll(".dropdown-option");

    if (!dropdown || !dropdownSelected || !dropdownOptions) return;

    // Toggle dropdown
    dropdownSelected.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
      }
    });

    // Handle option selection
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-value");
        const text = option.textContent.trim();

        // Update selected display
        dropdownSelected.querySelector("span").textContent = text;

        // Update active state
        options.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Close dropdown
        dropdown.classList.remove("open");

        // Update the encodings interface
        this.currentEncoding = value;
        this.updateInterface();
        this.clearFields();
      });
    });

    // Keyboard support
    dropdownSelected.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dropdown.classList.toggle("open");
      } else if (event.key === "Escape") {
        dropdown.classList.remove("open");
      }
    });

    // Make dropdown focusable
    dropdownSelected.setAttribute("tabindex", "0");
  }

  // Setup conversion type dropdown functionality
  setupConversionDropdown() {
    const dropdown = document.getElementById("conversion-type-dropdown");
    const dropdownSelected = document.getElementById(
      "conversion-dropdown-selected"
    );
    const dropdownOptions = document.getElementById(
      "conversion-dropdown-options"
    );
    const options = document.querySelectorAll(
      "#conversion-dropdown-options .dropdown-option"
    );

    if (!dropdown || !dropdownSelected || !dropdownOptions) return;

    // Remove existing event listeners by cloning and replacing the elements
    const newDropdownSelected = dropdownSelected.cloneNode(true);
    dropdownSelected.parentNode.replaceChild(
      newDropdownSelected,
      dropdownSelected
    );

    // Toggle dropdown
    newDropdownSelected.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
      }
    });

    // Handle option selection
    const currentOptions = document.querySelectorAll(
      "#conversion-dropdown-options .dropdown-option"
    );
    currentOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-value");
        const text = option.textContent.trim();

        // Update selected display
        newDropdownSelected.querySelector("span").textContent = text;

        // Update active state
        currentOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Close dropdown
        dropdown.classList.remove("open");

        // Update the conversion type
        this.currentConversionType = value;
        this.updateLabelsForConversionType();
        this.clearFields();
      });
    });

    // Keyboard support
    newDropdownSelected.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dropdown.classList.toggle("open");
      } else if (event.key === "Escape") {
        dropdown.classList.remove("open");
      }
    });

    // Make dropdown focusable
    newDropdownSelected.setAttribute("tabindex", "0");
  }
}

// Make the class globally available
window.EncodingsInterface = EncodingsInterface;

// Initialize the interface when the page loads
document.addEventListener("DOMContentLoaded", function () {
  const encodingsInterface = new EncodingsInterface();
  encodingsInterface.init();
  // Make it globally available for any external access if needed
  window.encodingsInterface = encodingsInterface;
});
