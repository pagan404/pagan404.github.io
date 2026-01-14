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

// Create mock functions that will be used across all tests
const mockGetEncoder = jest.fn();
const mockGetDecoder = jest.fn();
const mockSupportsDecoding = jest.fn();

// Mock the encodings module before any imports
jest.unstable_mockModule("../../../../src/encodings/index.js", () => ({
  getEncoder: mockGetEncoder,
  getDecoder: mockGetDecoder,
  supportsDecoding: mockSupportsDecoding,
}));

// Dynamic import after mocking
const { ConversionHandler } = await import("../ConversionHandler.js");

describe("ConversionHandler", () => {
  // Setup: Create mock DOM before each test
  beforeEach(() => {
    // Create a minimal DOM structure that ConversionHandler expects
    document.body.innerHTML = `
      <input id="text-input" />
      <textarea id="encoded-output"></textarea>
    `;

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Reset mock state before each test
    mockGetEncoder.mockReset();
    mockGetDecoder.mockReset();
    mockSupportsDecoding.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ============================================
  // 1. TEXT INPUT HANDLING TESTS
  // ============================================
  describe("handleTextInput", () => {
    const createMockInterface = (encoding, conversionType) => ({
      currentEncoding: encoding,
      currentConversionType: conversionType,
    });

    it("should encode text input successfully", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "hello";
      mockGetEncoder.mockReturnValue((input) => `encoded-${input}`);

      ConversionHandler.handleTextInput(mockInterface);

      expect(mockGetEncoder).toHaveBeenCalledWith("morse", "text");
      expect(encodedOutput.value).toBe("encoded-hello");
    });

    it("should clear output when input is empty", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "";
      encodedOutput.value = "previous output";

      ConversionHandler.handleTextInput(mockInterface);

      expect(encodedOutput.value).toBe("");
      expect(mockGetEncoder).not.toHaveBeenCalled();
    });

    it("should handle input too large error", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "a".repeat(501); // Over 500 chars

      ConversionHandler.handleTextInput(mockInterface);

      expect(encodedOutput.value).toBe(
        "Error: Input too large (max 500 characters)"
      );
      expect(mockGetEncoder).not.toHaveBeenCalled();
    });

    it("should handle encoding errors gracefully", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      textInput.value = "hello";
      mockGetEncoder.mockImplementation(() => {
        throw new Error("Encoding failed");
      });

      ConversionHandler.handleTextInput(mockInterface);

      expect(encodedOutput.value).toBe("Error: Encoding failed");
      expect(console.error).toHaveBeenCalledWith(
        "Encoding error:",
        expect.any(Error)
      );
    });

    it("should handle missing DOM elements gracefully", () => {
      const mockInterface = createMockInterface("morse", "text");

      document.getElementById("text-input").remove();
      document.getElementById("encoded-output").remove();

      expect(() => {
        ConversionHandler.handleTextInput(mockInterface);
      }).not.toThrow();

      expect(mockGetEncoder).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 2. ENCODED INPUT HANDLING TESTS
  // ============================================
  describe("handleEncodedInput", () => {
    const createMockInterface = (encoding, conversionType) => ({
      currentEncoding: encoding,
      currentConversionType: conversionType,
    });

    it("should decode encoded input successfully", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodedOutput.value = "....";
      mockSupportsDecoding.mockReturnValue(true);
      mockGetDecoder.mockReturnValue((input) => `decoded-${input}`);

      ConversionHandler.handleEncodedInput(mockInterface);

      expect(mockSupportsDecoding).toHaveBeenCalledWith("morse", "text");
      expect(mockGetDecoder).toHaveBeenCalledWith("morse", "text");
      expect(textInput.value).toBe("decoded-....");
    });

    it("should clear input when encoded output is empty", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodedOutput.value = "";
      textInput.value = "previous input";
      mockSupportsDecoding.mockReturnValue(true);

      ConversionHandler.handleEncodedInput(mockInterface);

      expect(textInput.value).toBe("");
      expect(mockGetDecoder).not.toHaveBeenCalled();
    });

    it("should skip decoding if not supported", () => {
      const mockInterface = createMockInterface(
        "braille",
        "braille2_contractions"
      );
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodedOutput.value = "some braille";
      textInput.value = "previous";
      mockSupportsDecoding.mockReturnValue(false);

      ConversionHandler.handleEncodedInput(mockInterface);

      expect(mockSupportsDecoding).toHaveBeenCalledWith(
        "braille",
        "braille2_contractions"
      );
      expect(mockGetDecoder).not.toHaveBeenCalled();
      expect(textInput.value).toBe("previous"); // Unchanged
    });

    it("should handle input too large error", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodedOutput.value = "a".repeat(501); // Over 500 chars
      mockSupportsDecoding.mockReturnValue(true);

      ConversionHandler.handleEncodedInput(mockInterface);

      expect(textInput.value).toBe(
        "Error: Input too large (max 500 characters)"
      );
      expect(mockGetDecoder).not.toHaveBeenCalled();
    });

    it("should handle decoding errors gracefully", () => {
      const mockInterface = createMockInterface("morse", "text");
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodedOutput.value = "....";
      mockSupportsDecoding.mockReturnValue(true);
      mockGetDecoder.mockImplementation(() => {
        throw new Error("Decoding failed");
      });

      ConversionHandler.handleEncodedInput(mockInterface);

      expect(textInput.value).toBe("Error: Decoding failed");
      expect(console.error).toHaveBeenCalledWith(
        "Decoding error:",
        expect.any(Error)
      );
    });

    it("should handle missing DOM elements gracefully", () => {
      const mockInterface = createMockInterface("morse", "text");

      document.getElementById("text-input").remove();
      document.getElementById("encoded-output").remove();
      mockSupportsDecoding.mockReturnValue(true);

      expect(() => {
        ConversionHandler.handleEncodedInput(mockInterface);
      }).not.toThrow();

      expect(mockGetDecoder).not.toHaveBeenCalled();
    });
  });
});
