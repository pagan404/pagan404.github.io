/**
 * @jest-environment jsdom
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { UIUtils } from "../UIUtils.js";

/**
 * REFACTOR-PROOF UNIT TESTS - UIUtils
 *
 * These tests focus on STATE CHANGES in the DOM rather than testing
 * which internal methods get called. This makes them resilient to
 * internal refactoring.
 *
 * Key Principles:
 * - Test what CHANGED in the DOM (element text, attributes, values)
 * - Test OUTCOMES (what the user sees), not internal method calls
 * - Avoid testing implementation details
 * - Tests should survive method renames and internal refactoring
 */

describe("UIUtils", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="converter-title"></div>
      <div id="converter-description"></div>
      <label id="input-label"></label>
      <label id="output-label"></label>
      <input id="text-input" />
      <textarea id="encoded-output"></textarea>
      <span id="encode-btn-text"></span>
      <span id="decode-btn-text"></span>
      <button id="copy-result">Copy</button>
    `;

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  // ============================================
  // DOM ELEMENT UPDATES - STATE TESTS
  // ============================================
  describe("updateElement", () => {
    it("should change element textContent in DOM", () => {
      UIUtils.updateElement("converter-title", "Test Title");

      // STATE ASSERTION: Check what actually changed in DOM
      const element = document.getElementById("converter-title");
      expect(element.textContent).toBe("Test Title");
    });

    it("should handle non-existent elements without crashing", () => {
      // BEHAVIOR ASSERTION: No error thrown
      expect(() => {
        UIUtils.updateElement("non-existent-id", "Test");
      }).not.toThrow();
    });

    it("should clear element content when given empty string", () => {
      const element = document.getElementById("converter-title");
      element.textContent = "Initial Content";

      UIUtils.updateElement("converter-title", "");

      // STATE ASSERTION: Content was cleared
      expect(element.textContent).toBe("");
    });
  });

  // ============================================
  // LABELS FOR MORSE CODE - STATE TESTS
  // ============================================
  describe("updateLabelsForConversionType - Morse", () => {
    it("should set morse-specific labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "morse",
        currentConversionType: "text",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Check actual DOM text content
      expect(document.getElementById("input-label").textContent).toBe(
        "Text Input",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Morse Code Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Text → Morse",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Morse → Text",
      );
    });
  });

  // ============================================
  // LABELS FOR BINARY - STATE TESTS
  // ============================================
  describe("updateLabelsForConversionType - Binary", () => {
    it("should set binary number labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "number",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Labels reflect number conversion mode
      expect(document.getElementById("input-label").textContent).toBe(
        "Decimal Number",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Binary Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Decimal → Binary",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Binary → Decimal",
      );
    });

    it("should set binary text labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "text",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Labels reflect text conversion mode
      expect(document.getElementById("input-label").textContent).toBe(
        "Text Input",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Binary Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Text → Binary",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Binary → Text",
      );
    });

    it("should enable encoded output field for binary", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "number",
      };
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.disabled = true;

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTION: Field is now enabled
      expect(encodedOutput.disabled).toBe(false);
    });
  });

  // ============================================
  // LABELS FOR HEXADECIMAL - STATE TESTS
  // ============================================
  describe("updateLabelsForConversionType - Hexadecimal", () => {
    it("should set hex number labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "hex",
        currentConversionType: "number",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Hex-specific labels
      expect(document.getElementById("input-label").textContent).toBe(
        "Decimal Number",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Hexadecimal Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Decimal → Hex",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Hex → Decimal",
      );
    });

    it("should set hex text labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "hex",
        currentConversionType: "text",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Text mode labels
      expect(document.getElementById("input-label").textContent).toBe(
        "Text Input",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Hexadecimal Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Text → Hex",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Hex → Text",
      );
    });
  });

  // ============================================
  // LABELS FOR BRAILLE - STATE TESTS
  // ============================================
  describe("updateLabelsForConversionType - Braille", () => {
    it("should set braille labels in DOM", () => {
      const mockInterface = {
        currentEncoding: "braille",
        currentConversionType: "braille1",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTIONS: Braille-specific labels
      expect(document.getElementById("input-label").textContent).toBe(
        "Text Input",
      );
      expect(document.getElementById("output-label").textContent).toBe(
        "Braille Output",
      );
      expect(document.getElementById("encode-btn-text").textContent).toBe(
        "Text → Braille",
      );
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "Braille → Text",
      );
    });

    it("should enable output field for standard braille", () => {
      const mockInterface = {
        currentEncoding: "braille",
        currentConversionType: "braille1",
      };
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.disabled = true;

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTION: Output enabled for two-way conversion
      expect(encodedOutput.disabled).toBe(false);
    });

    it("should disable output field for braille contractions", () => {
      const mockInterface = {
        currentEncoding: "braille",
        currentConversionType: "braille2_contractions",
      };
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.disabled = false;

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTION: Output disabled for one-way conversion
      expect(encodedOutput.disabled).toBe(true);
    });

    it("should set one-way conversion text for braille contractions", () => {
      const mockInterface = {
        currentEncoding: "braille",
        currentConversionType: "braille2_contractions",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      // STATE ASSERTION: Button text indicates one-way only
      expect(document.getElementById("decode-btn-text").textContent).toBe(
        "One-way only",
      );
    });

    it("should set contractions placeholder when output disabled", () => {
      const mockInterface = {
        currentEncoding: "braille",
        currentConversionType: "braille2_contractions",
      };

      UIUtils.updateLabelsForConversionType(mockInterface);

      const encodedOutput = document.getElementById("encoded-output");

      // STATE ASSERTION: Placeholder explains one-way limitation
      expect(encodedOutput.placeholder).toBe(
        "Braille with contractions (one-way conversion only)",
      );
    });
  });

  // ============================================
  // PLACEHOLDERS - STATE TESTS
  // ============================================
  describe("updatePlaceholders", () => {
    it("should set morse code placeholders in DOM", () => {
      const mockInterface = {
        currentEncoding: "morse",
        currentConversionType: "text",
      };

      UIUtils.updatePlaceholders(mockInterface);

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      // STATE ASSERTIONS: Placeholders are set
      expect(textInput.placeholder).toBe("Enter your text here...");
      expect(encodedOutput.placeholder).toBe("Morse code will appear here...");
    });

    it("should set binary number placeholders in DOM", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "number",
      };

      UIUtils.updatePlaceholders(mockInterface);

      const textInput = document.getElementById("text-input");

      // STATE ASSERTION: Placeholder mentions decimal/number
      expect(textInput.placeholder).toBe("Enter decimal number (e.g., 42)...");
    });

    it("should change placeholders when switching conversion types", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "number",
      };

      UIUtils.updatePlaceholders(mockInterface);
      const numberPlaceholder =
        document.getElementById("text-input").placeholder;

      // Switch to text mode
      mockInterface.currentConversionType = "text";
      UIUtils.updatePlaceholders(mockInterface);
      const textPlaceholder = document.getElementById("text-input").placeholder;

      // STATE ASSERTION: Placeholders are different for different modes
      expect(numberPlaceholder).toBe("Enter decimal number (e.g., 42)...");
      expect(textPlaceholder).toBe("Enter text to convert...");
      expect(numberPlaceholder).not.toBe(textPlaceholder);
    });

    it("should handle missing DOM elements without crashing", () => {
      const mockInterface = {
        currentEncoding: "morse",
        currentConversionType: "text",
      };

      document.getElementById("text-input").remove();
      document.getElementById("encoded-output").remove();

      // BEHAVIOR ASSERTION: No error thrown
      expect(() => {
        UIUtils.updatePlaceholders(mockInterface);
      }).not.toThrow();
    });
  });

  // ============================================
  // CLEAR FIELDS - STATE TESTS
  // ============================================
  describe("clearFields", () => {
    it("should clear values of both input fields", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "Some text";
      encodedOutput.value = "Some output";

      UIUtils.clearFields();

      // STATE ASSERTIONS: Both fields are empty
      expect(textInput.value).toBe("");
      expect(encodedOutput.value).toBe("");
    });

    it("should handle already-empty fields", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "";
      encodedOutput.value = "";

      UIUtils.clearFields();

      // STATE ASSERTIONS: Still empty, no errors
      expect(textInput.value).toBe("");
      expect(encodedOutput.value).toBe("");
    });

    it("should handle missing DOM elements without crashing", () => {
      document.getElementById("text-input").remove();

      // BEHAVIOR ASSERTION: No error thrown
      expect(() => {
        UIUtils.clearFields();
      }).not.toThrow();
    });
  });

  // ============================================
  // COPY TO CLIPBOARD - STATE TESTS
  // ============================================
  describe("copyResult", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should copy output value to clipboard", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test output to copy";

      await UIUtils.copyResult();

      // STATE ASSERTION: Clipboard received the correct value
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "Test output to copy",
      );
    });

    it("should temporarily change button text to show success", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      const copyBtn = document.getElementById("copy-result");

      encodedOutput.value = "Test";
      copyBtn.textContent = "Copy";

      await UIUtils.copyResult();

      // STATE ASSERTION: Button text changed immediately
      expect(copyBtn.textContent).toBe("Copied!");

      // Fast-forward time
      jest.advanceTimersByTime(2000);

      // STATE ASSERTION: Button text reverted
      expect(copyBtn.textContent).toBe("Copy");
    });

    it("should not copy when output is empty", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "";

      await UIUtils.copyResult();

      // STATE ASSERTION: Clipboard not called for empty value
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it("should handle clipboard API errors gracefully", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test";

      navigator.clipboard.writeText.mockRejectedValue(
        new Error("Clipboard denied"),
      );

      await UIUtils.copyResult();

      // BEHAVIOR ASSERTION: Error logged, no crash
      expect(console.error).toHaveBeenCalledWith(
        "Failed to copy: ",
        expect.any(Error),
      );
    });

    it("should handle missing button element", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test";
      document.getElementById("copy-result").remove();

      // BEHAVIOR ASSERTION: No error thrown
      await expect(UIUtils.copyResult()).resolves.not.toThrow();
    });
  });

  // ============================================
  // STATE TRANSITION TESTS
  // ============================================
  describe("State transitions", () => {
    it("should correctly transition labels from morse to binary", () => {
      const mockInterface = {
        currentEncoding: "morse",
        currentConversionType: "text",
      };

      // Initial state: Morse
      UIUtils.updateLabelsForConversionType(mockInterface);
      const morseLabel = document.getElementById("input-label").textContent;

      // Transition to binary
      mockInterface.currentEncoding = "binary";
      mockInterface.currentConversionType = "number";
      UIUtils.updateLabelsForConversionType(mockInterface);
      const binaryLabel = document.getElementById("input-label").textContent;

      // STATE ASSERTIONS: Labels changed appropriately
      expect(morseLabel).toBe("Text Input");
      expect(binaryLabel).toBe("Decimal Number");
      expect(morseLabel).not.toBe(binaryLabel);
    });

    it("should correctly transition between binary conversion types", () => {
      const mockInterface = {
        currentEncoding: "binary",
        currentConversionType: "number",
      };

      // Initial: Number mode
      UIUtils.updateLabelsForConversionType(mockInterface);
      const numberLabel = document.getElementById("input-label").textContent;

      // Switch to text mode
      mockInterface.currentConversionType = "text";
      UIUtils.updateLabelsForConversionType(mockInterface);
      const textLabel = document.getElementById("input-label").textContent;

      // STATE ASSERTIONS: Labels reflect mode change
      expect(numberLabel).toBe("Decimal Number");
      expect(textLabel).toBe("Text Input");
    });

    it("should maintain independent state for different operations", () => {
      const textInput = document.getElementById("text-input");
      textInput.value = "test";

      // Update title
      UIUtils.updateElement("converter-title", "Test Title");

      // Clear fields
      UIUtils.clearFields();

      // STATE ASSERTIONS: Operations don't interfere with each other
      expect(document.getElementById("converter-title").textContent).toBe(
        "Test Title",
      );
      expect(textInput.value).toBe("");
    });
  });
});
