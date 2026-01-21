/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "@jest/globals";

// NO MOCKING - Import real modules to test actual integration
import { EncodingsInterface } from "../EncodingsInterface.js";

/**
 * INTEGRATION TESTS - ENCODINGS UI WORKFLOWS
 *
 * These tests focus on user-facing behavior and complete workflows.
 * They should survive refactoring because they test WHAT the UI does,
 * not HOW it does it internally.
 *
 * Key Principles:
 * - No mocking of internal modules
 * - Test through DOM interactions (what users see)
 * - Focus on happy path scenarios
 * - Test complete user journeys
 */

describe("Encodings UI Integration Tests", () => {
  let encodingsInterface;

  beforeEach(() => {
    // Create complete DOM structure that matches the actual HTML
    document.body.innerHTML = `
      <div id="converter-title"></div>
      <div id="converter-description"></div>
      
      <div id="conversion-type-container">
        <label for="conversion-type-dropdown">Conversion Type:</label>
        <select id="conversion-type-dropdown"></select>
      </div>
      
      <div id="encoding-dropdown-container">
        <label for="encoding-dropdown">Encoding Type:</label>
        <select id="encoding-dropdown"></select>
      </div>
      
      <div class="input-section">
        <label id="input-label">Text Input</label>
        <input id="text-input" type="text" />
      </div>
      
      <div class="output-section">
        <label id="output-label">Encoded Output</label>
        <textarea id="encoded-output"></textarea>
      </div>
      
      <div class="button-group">
        <button id="text-to-encoded">Convert →</button>
        <button id="encoded-to-text">← Convert Back</button>
        <button id="clear-all">Clear</button>
        <button id="copy-result">Copy</button>
      </div>
    `;

    // Initialize the interface with real implementations
    encodingsInterface = new EncodingsInterface();
    encodingsInterface.init();
  });

  // ============================================
  // MORSE CODE WORKFLOWS
  // ============================================
  describe("Morse Code Conversion", () => {
    beforeEach(() => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();
    });

    it("should convert text to morse code in real-time", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types "SOS"
      textInput.value = "SOS";
      textInput.dispatchEvent(new Event("input"));

      // User sees morse code output
      expect(encodedOutput.value).toBe("... --- ...");
    });

    it("should convert morse code back to text in real-time", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types morse code
      encodedOutput.value = ".... . .-.. .-.. ---";
      encodedOutput.dispatchEvent(new Event("input"));

      // User sees text output
      expect(textInput.value.toUpperCase()).toBe("HELLO");
    });

    it("should handle complete morse code workflow", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // Step 1: User types a message
      textInput.value = "HELP";
      textInput.dispatchEvent(new Event("input"));

      // Step 2: User sees morse code
      const morseOutput = encodedOutput.value;
      expect(morseOutput).toBe(".... . .-.. .--.");

      // Step 3: User clears text input
      textInput.value = "";

      // Step 4: User types the morse code manually
      encodedOutput.value = morseOutput;
      encodedOutput.dispatchEvent(new Event("input"));

      // Step 5: User gets back original message
      expect(textInput.value.toUpperCase()).toBe("HELP");
    });

    it("should show morse-specific UI elements", () => {
      const title = document.getElementById("converter-title");
      const description = document.getElementById("converter-description");
      const conversionTypeContainer = document.getElementById(
        "conversion-type-container",
      );

      // User sees morse code title
      expect(title.textContent).toContain("Morse");

      // Morse doesn't show conversion type selector
      expect(conversionTypeContainer.style.display).toBe("none");
    });
  });

  // ============================================
  // BINARY CONVERSION WORKFLOWS
  // ============================================
  describe("Binary Conversion", () => {
    beforeEach(() => {
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();
    });

    it("should convert decimal numbers to binary", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters decimal number
      textInput.value = "42";
      textInput.dispatchEvent(new Event("input"));

      // User sees binary output (may be padded)
      expect(encodedOutput.value).toMatch(/0*101010/);
    });

    it("should convert binary back to decimal", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters binary
      encodedOutput.value = "1111";
      encodedOutput.dispatchEvent(new Event("input"));

      // User sees decimal output
      expect(textInput.value).toBe("15");
    });

    it("should convert text to binary when conversion type is text", () => {
      encodingsInterface.currentConversionType = "text";
      encodingsInterface.updateInterface();

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types text
      textInput.value = "Hi";
      textInput.dispatchEvent(new Event("input"));

      // User sees binary representation of text
      expect(encodedOutput.value).toMatch(/^[01\s]+$/);
      expect(encodedOutput.value.length).toBeGreaterThan(0);
    });

    it("should show conversion type selector for binary", () => {
      const conversionTypeContainer = document.getElementById(
        "conversion-type-container",
      );

      // Binary shows conversion type dropdown
      expect(conversionTypeContainer.style.display).toBe("block");
    });
  });

  // ============================================
  // HEXADECIMAL CONVERSION WORKFLOWS
  // ============================================
  describe("Hexadecimal Conversion", () => {
    beforeEach(() => {
      encodingsInterface.currentEncoding = "hex";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();
    });

    it("should convert decimal to hexadecimal", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters decimal
      textInput.value = "255";
      textInput.dispatchEvent(new Event("input"));

      // User sees hex output
      expect(encodedOutput.value.toUpperCase()).toBe("FF");
    });

    it("should convert hexadecimal back to decimal", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters hex
      encodedOutput.value = "1A";
      encodedOutput.dispatchEvent(new Event("input"));

      // User sees decimal output
      expect(textInput.value).toBe("26");
    });

    it("should convert text to hex when conversion type is text", () => {
      encodingsInterface.currentConversionType = "text";
      encodingsInterface.updateInterface();

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types text
      textInput.value = "AB";
      textInput.dispatchEvent(new Event("input"));

      // User sees hex representation
      expect(encodedOutput.value).toMatch(/^[0-9A-Fa-f\s]+$/);
    });
  });

  // ============================================
  // BRAILLE CONVERSION WORKFLOWS
  // ============================================
  describe("Braille Conversion", () => {
    beforeEach(() => {
      encodingsInterface.currentEncoding = "braille";
      encodingsInterface.currentConversionType = "braille1";
      encodingsInterface.updateInterface();
    });

    it("should convert text to grade 1 braille", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types text
      textInput.value = "HELLO";
      textInput.dispatchEvent(new Event("input"));

      // User sees braille characters
      expect(encodedOutput.value).toBeTruthy();
      expect(encodedOutput.value).toMatch(/^[⠀-⣿\s]+$/);
    });

    it("should convert braille back to text for grade 1", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // First convert to braille
      textInput.value = "A";
      textInput.dispatchEvent(new Event("input"));

      const brailleOutput = encodedOutput.value;

      // Then convert back
      textInput.value = "";
      encodedOutput.value = brailleOutput;
      encodedOutput.dispatchEvent(new Event("input"));

      expect(textInput.value.toUpperCase()).toBe("A");
    });

    it("should show conversion type selector for braille", () => {
      const conversionTypeContainer = document.getElementById(
        "conversion-type-container",
      );

      // Braille shows conversion type dropdown
      expect(conversionTypeContainer.style.display).toBe("block");
    });
  });

  // ============================================
  // ENCODING SWITCHING WORKFLOWS
  // ============================================
  describe("Switching Between Encodings", () => {
    it("should update UI when switching from morse to binary", () => {
      // Start with morse
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();

      const morseTitle = document.getElementById("converter-title").textContent;
      const morseConversionType = document.getElementById(
        "conversion-type-container",
      ).style.display;

      // Switch to binary
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();

      const binaryTitle =
        document.getElementById("converter-title").textContent;
      const binaryConversionType = document.getElementById(
        "conversion-type-container",
      ).style.display;

      // UI should be different
      expect(binaryTitle).not.toBe(morseTitle);
      expect(binaryTitle).toContain("Binary");
      expect(morseConversionType).toBe("none");
      expect(binaryConversionType).toBe("block");
    });

    it("should maintain functionality after switching encodings", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // Test morse code
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();

      textInput.value = "HI";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toContain("."); // Morse uses dots

      // Switch to binary
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();

      textInput.value = "5";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toMatch(/0*101$/); // Binary for 5

      // Switch to hex
      encodingsInterface.currentEncoding = "hex";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();

      textInput.value = "16";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value.toUpperCase()).toBe("10"); // Hex for 16
    });
  });

  // ============================================
  // UI INTERACTION WORKFLOWS
  // ============================================
  describe("User Interface Interactions", () => {
    beforeEach(() => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();
    });

    it("should clear both input fields when clear button is clicked", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");
      const clearBtn = document.getElementById("clear-all");

      // User enters data
      textInput.value = "TEST";
      encodedOutput.value = "- . ... -";

      // User clicks clear
      clearBtn.click();

      // Both fields are empty
      expect(textInput.value).toBe("");
      expect(encodedOutput.value).toBe("");
    });

    it("should handle manual button conversion", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");
      const convertBtn = document.getElementById("text-to-encoded");

      // User types but doesn't trigger input event
      textInput.value = "OK";

      // User clicks convert button
      convertBtn.click();

      // Output is updated
      expect(encodedOutput.value).toBe("--- -.-");
    });

    it("should handle reverse conversion button", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");
      const reverseBtn = document.getElementById("encoded-to-text");

      // User enters morse code
      encodedOutput.value = "... --- ...";

      // User clicks reverse button
      reverseBtn.click();

      // Text appears
      expect(textInput.value.toUpperCase()).toBe("SOS");
    });

    it("should handle empty input gracefully", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters empty text
      textInput.value = "";
      textInput.dispatchEvent(new Event("input"));

      // Output is cleared
      expect(encodedOutput.value).toBe("");
    });

    it("should clear output when input is cleared", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User enters text
      textInput.value = "ABC";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toBeTruthy();

      // User clears input
      textInput.value = "";
      textInput.dispatchEvent(new Event("input"));

      // Output is also cleared
      expect(encodedOutput.value).toBe("");
    });
  });

  // ============================================
  // REAL-TIME CONVERSION WORKFLOWS
  // ============================================
  describe("Real-time Bidirectional Conversion", () => {
    it("should support real-time two-way conversion for morse", () => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types text → sees morse
      textInput.value = "A";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toBe(".-");

      // User types more → morse updates
      textInput.value = "AB";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toBe(".- -...");

      // User modifies morse → text updates
      encodedOutput.value = ".-";
      encodedOutput.dispatchEvent(new Event("input"));
      expect(textInput.value.toUpperCase()).toBe("A");
    });

    it("should support real-time conversion for binary numbers", () => {
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.currentConversionType = "number";
      encodingsInterface.updateInterface();

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // User types decimal → sees binary (may be padded)
      textInput.value = "1";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toMatch(/0*1$/);

      textInput.value = "10";
      textInput.dispatchEvent(new Event("input"));
      expect(encodedOutput.value).toMatch(/0*1010$/);

      // User types binary → sees decimal
      encodedOutput.value = "100";
      encodedOutput.dispatchEvent(new Event("input"));
      expect(textInput.value).toBe("4");
    });
  });

  // ============================================
  // INITIALIZATION WORKFLOW
  // ============================================
  describe("Initial Page Load", () => {
    it("should initialize with morse code converter by default", () => {
      // Fresh initialization
      const freshInterface = new EncodingsInterface();
      freshInterface.init();

      const title = document.getElementById("converter-title");

      // Default encoding is morse
      expect(freshInterface.currentEncoding).toBe("morse");
      expect(title.textContent).toContain("Morse");
    });

    it("should have working converter immediately after init", () => {
      // Fresh initialization
      const freshInterface = new EncodingsInterface();
      freshInterface.init();

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // Should work right away
      textInput.value = "GO";
      textInput.dispatchEvent(new Event("input"));

      expect(encodedOutput.value).toBe("--. ---");
    });
  });
});
