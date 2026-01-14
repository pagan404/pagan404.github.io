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

describe("UIUtils", () => {
  // Setup: Create mock DOM before each test
  beforeEach(() => {
    // Create a minimal DOM structure that UIUtils expects
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

    // Mock clipboard API (not available in jsdom)
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  // ============================================
  // 1. BASIC DOM MANIPULATION TESTS
  // ============================================
  describe("updateElement", () => {
    it("should update element textContent when element exists", () => {
      UIUtils.updateElement("converter-title", "Test Title");

      const element = document.getElementById("converter-title");
      expect(element.textContent).toBe("Test Title");
    });

    it("should handle non-existent elements gracefully", () => {
      // Should not throw error
      expect(() => {
        UIUtils.updateElement("non-existent-id", "Test");
      }).not.toThrow();
    });

    it("should update with empty string", () => {
      UIUtils.updateElement("converter-title", "Initial");
      UIUtils.updateElement("converter-title", "");

      expect(document.getElementById("converter-title").textContent).toBe("");
    });
  });

  // ============================================
  // 2. LABEL UPDATE LOGIC TESTS
  // ============================================
  describe("updateLabelsForConversionType", () => {
    // Helper to create a mock EncodingsInterface
    const createMockInterface = (encoding, conversionType) => ({
      currentEncoding: encoding,
      currentConversionType: conversionType,
    });

    // --- Morse Code (simple encoding, no conversion type) ---
    describe("Morse encoding", () => {
      it("should update labels for morse code correctly", () => {
        const mockInterface = createMockInterface("morse", "text");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Text Input"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Morse Code Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Text → Morse"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Morse → Text"
        );
      });
    });

    // --- Binary (number vs text conversion) ---
    describe("Binary encoding", () => {
      it("should update labels for binary number conversion", () => {
        const mockInterface = createMockInterface("binary", "number");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Decimal Number"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Binary Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Decimal → Binary"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Binary → Decimal"
        );
      });

      it("should update labels for binary text conversion", () => {
        const mockInterface = createMockInterface("binary", "text");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Text Input"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Binary Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Text → Binary"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Binary → Text"
        );
      });

      it("should enable encoded output for binary", () => {
        const mockInterface = createMockInterface("binary", "number");
        const encodedOutput = document.getElementById("encoded-output");
        encodedOutput.disabled = true; // Start disabled

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(encodedOutput.disabled).toBe(false);
      });
    });

    // --- Hexadecimal (number vs text conversion) ---
    describe("Hexadecimal encoding", () => {
      it("should update labels for hex number conversion", () => {
        const mockInterface = createMockInterface("hex", "number");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Decimal Number"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Hexadecimal Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Decimal → Hex"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Hex → Decimal"
        );
      });

      it("should update labels for hex text conversion", () => {
        const mockInterface = createMockInterface("hex", "text");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Text Input"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Hexadecimal Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Text → Hex"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Hex → Text"
        );
      });
    });

    // --- Braille (with special contractions handling) ---
    describe("Braille encoding", () => {
      it("should update labels for braille without contractions", () => {
        const mockInterface = createMockInterface("braille", "braille1");

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("input-label").textContent).toBe(
          "Text Input"
        );
        expect(document.getElementById("output-label").textContent).toBe(
          "Braille Output"
        );
        expect(document.getElementById("encode-btn-text").textContent).toBe(
          "Text → Braille"
        );
        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "Braille → Text"
        );
      });

      it("should update labels for braille with contractions", () => {
        const mockInterface = createMockInterface(
          "braille",
          "braille2_contractions"
        );

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(document.getElementById("decode-btn-text").textContent).toBe(
          "One-way only"
        );
      });

      it("should disable output field for braille contractions", () => {
        const mockInterface = createMockInterface(
          "braille",
          "braille2_contractions"
        );
        const encodedOutput = document.getElementById("encoded-output");
        encodedOutput.disabled = false; // Start enabled

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(encodedOutput.disabled).toBe(true);
        expect(encodedOutput.placeholder).toBe(
          "Braille with contractions (one-way conversion only)"
        );
      });

      it("should enable output field for braille without contractions", () => {
        const mockInterface = createMockInterface("braille", "braille1");
        const encodedOutput = document.getElementById("encoded-output");
        encodedOutput.disabled = true; // Start disabled

        UIUtils.updateLabelsForConversionType(mockInterface);

        expect(encodedOutput.disabled).toBe(false);
      });
    });
  });

  // ============================================
  // 3. PLACEHOLDER UPDATE TESTS
  // ============================================
  describe("updatePlaceholders", () => {
    const createMockInterface = (encoding, conversionType) => ({
      currentEncoding: encoding,
      currentConversionType: conversionType,
    });

    it("should update placeholders for morse code", () => {
      const mockInterface = createMockInterface("morse", "text");

      UIUtils.updatePlaceholders(mockInterface);

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      expect(textInput.placeholder).toBe("Enter your text here...");
      expect(encodedOutput.placeholder).toBe("Morse code will appear here...");
    });

    it("should update placeholders for binary number conversion", () => {
      const mockInterface = createMockInterface("binary", "number");

      UIUtils.updatePlaceholders(mockInterface);

      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      expect(textInput.placeholder).toBe("Enter decimal number (e.g., 42)...");
      expect(encodedOutput.placeholder).toBe("Binary will appear here...");
    });

    it("should update placeholders for binary text conversion", () => {
      const mockInterface = createMockInterface("binary", "text");

      UIUtils.updatePlaceholders(mockInterface);

      const textInput = document.getElementById("text-input");

      expect(textInput.placeholder).toBe("Enter text to convert...");
    });

    it("should update placeholders for braille with contractions", () => {
      const mockInterface = createMockInterface(
        "braille",
        "braille2_contractions"
      );

      UIUtils.updatePlaceholders(mockInterface);

      const encodedOutput = document.getElementById("encoded-output");

      expect(encodedOutput.placeholder).toBe(
        "Braille with contractions (one-way conversion only)"
      );
    });

    it("should handle missing elements gracefully", () => {
      document.getElementById("text-input").remove();
      document.getElementById("encoded-output").remove();

      const mockInterface = createMockInterface("morse", "text");

      expect(() => {
        UIUtils.updatePlaceholders(mockInterface);
      }).not.toThrow();
    });
  });

  // ============================================
  // 4. FIELD CLEARING TESTS
  // ============================================
  describe("clearFields", () => {
    it("should clear both input fields", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "Some text";
      encodedOutput.value = "Some output";

      UIUtils.clearFields();

      expect(textInput.value).toBe("");
      expect(encodedOutput.value).toBe("");
    });

    it("should handle missing elements gracefully", () => {
      document.getElementById("text-input").remove();

      expect(() => {
        UIUtils.clearFields();
      }).not.toThrow();
    });
  });

  // ============================================
  // 5. CLIPBOARD COPY TESTS
  // ============================================
  describe("copyResult", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should copy encoded output to clipboard", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test output to copy";

      await UIUtils.copyResult();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "Test output to copy"
      );
    });

    it("should update button text temporarily after successful copy", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      const copyBtn = document.getElementById("copy-result");
      encodedOutput.value = "Test";

      await UIUtils.copyResult();

      expect(copyBtn.textContent).toBe("Copied!");

      // Fast-forward time
      jest.advanceTimersByTime(2000);

      expect(copyBtn.textContent).toBe("Copy");
    });

    it("should not copy if output is empty", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "";

      await UIUtils.copyResult();

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it("should handle clipboard API failure gracefully", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test";

      navigator.clipboard.writeText.mockRejectedValue(
        new Error("Clipboard denied")
      );

      await UIUtils.copyResult();

      expect(console.error).toHaveBeenCalledWith(
        "Failed to copy: ",
        expect.any(Error)
      );
    });

    it("should handle missing button element", async () => {
      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.value = "Test";
      document.getElementById("copy-result").remove();

      await expect(UIUtils.copyResult()).resolves.not.toThrow();
    });
  });
});
