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

// Create mock functions for dependencies
const mockUIUtilsUpdateElement = jest.fn();
const mockUIUtilsUpdateLabelsForConversionType = jest.fn();
const mockUIUtilsUpdatePlaceholders = jest.fn();
const mockUIUtilsClearFields = jest.fn();
const mockUIUtilsCopyResult = jest.fn();

const mockConversionHandlerHandleTextInput = jest.fn();
const mockConversionHandlerHandleEncodedInput = jest.fn();

const mockDropdownManagerSetupEncodingDropdown = jest.fn();
const mockDropdownManagerSetupConversionDropdown = jest.fn();
const mockDropdownManagerUpdateConversionTypeOptions = jest.fn();

// Mock UIUtils module
jest.unstable_mockModule("../UIUtils.js", () => ({
  UIUtils: {
    updateElement: mockUIUtilsUpdateElement,
    updateLabelsForConversionType: mockUIUtilsUpdateLabelsForConversionType,
    updatePlaceholders: mockUIUtilsUpdatePlaceholders,
    clearFields: mockUIUtilsClearFields,
    copyResult: mockUIUtilsCopyResult,
  },
}));

// Mock ConversionHandler module
jest.unstable_mockModule("../ConversionHandler.js", () => ({
  ConversionHandler: {
    handleTextInput: mockConversionHandlerHandleTextInput,
    handleEncodedInput: mockConversionHandlerHandleEncodedInput,
  },
}));

// Mock DropdownManager module
jest.unstable_mockModule("../DropdownManager.js", () => ({
  DropdownManager: {
    setupEncodingDropdown: mockDropdownManagerSetupEncodingDropdown,
    setupConversionDropdown: mockDropdownManagerSetupConversionDropdown,
    updateConversionTypeOptions: mockDropdownManagerUpdateConversionTypeOptions,
  },
}));

// Dynamic import after mocking
const { EncodingsInterface } = await import("../EncodingsInterface.js");

describe("EncodingsInterface", () => {
  let encodingsInterface;

  // Setup: Create mock DOM before each test
  beforeEach(() => {
    // Create a minimal DOM structure that EncodingsInterface expects
    document.body.innerHTML = `
      <div id="converter-title"></div>
      <div id="converter-description"></div>
      <input id="text-input" />
      <textarea id="encoded-output"></textarea>
      <button id="text-to-encoded"></button>
      <button id="encoded-to-text"></button>
      <button id="clear-all"></button>
      <button id="copy-result"></button>
      <div id="conversion-type-container">
        <div id="conversion-type-dropdown"></div>
      </div>
      <label id="input-label"></label>
      <label id="output-label"></label>
    `;

    // Reset all mocks before each test
    mockUIUtilsUpdateElement.mockReset();
    mockUIUtilsUpdateLabelsForConversionType.mockReset();
    mockUIUtilsUpdatePlaceholders.mockReset();
    mockUIUtilsClearFields.mockReset();
    mockUIUtilsCopyResult.mockReset();
    mockConversionHandlerHandleTextInput.mockReset();
    mockConversionHandlerHandleEncodedInput.mockReset();
    mockDropdownManagerSetupEncodingDropdown.mockReset();
    mockDropdownManagerSetupConversionDropdown.mockReset();
    mockDropdownManagerUpdateConversionTypeOptions.mockReset();

    // Mock window.alert
    global.alert = jest.fn();

    // Create fresh instance
    encodingsInterface = new EncodingsInterface();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ============================================
  // 1. CONSTRUCTOR TESTS
  // ============================================
  describe("constructor", () => {
    it("should initialize with default encoding and conversion type", () => {
      expect(encodingsInterface.currentEncoding).toBe("morse");
      expect(encodingsInterface.currentConversionType).toBe("text");
    });
  });

  // ============================================
  // 2. INITIALIZATION TESTS
  // ============================================
  describe("init", () => {
    it("should call all setup methods", () => {
      encodingsInterface.init();

      expect(mockDropdownManagerSetupEncodingDropdown).toHaveBeenCalledWith(
        encodingsInterface
      );
      expect(mockDropdownManagerSetupConversionDropdown).toHaveBeenCalledWith(
        encodingsInterface
      );
      expect(mockUIUtilsUpdateElement).toHaveBeenCalled();
    });

    it("should setup event listeners", () => {
      const textInput = document.getElementById("text-input");
      const encodedOutput = document.getElementById("encoded-output");

      encodingsInterface.init();

      // Trigger input events
      textInput.dispatchEvent(new Event("input"));
      encodedOutput.dispatchEvent(new Event("input"));

      expect(mockConversionHandlerHandleTextInput).toHaveBeenCalledWith(
        encodingsInterface
      );
      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });
  });

  // ============================================
  // 3. EVENT LISTENER SETUP TESTS
  // ============================================
  describe("setupEventListeners", () => {
    it("should attach input event to text input field", () => {
      encodingsInterface.setupEventListeners();

      const textInput = document.getElementById("text-input");
      textInput.dispatchEvent(new Event("input"));

      expect(mockConversionHandlerHandleTextInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should attach input event to encoded output field", () => {
      encodingsInterface.setupEventListeners();

      const encodedOutput = document.getElementById("encoded-output");
      encodedOutput.dispatchEvent(new Event("input"));

      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should attach click event to text-to-encoded button", () => {
      encodingsInterface.setupEventListeners();

      const textToEncodedBtn = document.getElementById("text-to-encoded");
      textToEncodedBtn.click();

      expect(mockConversionHandlerHandleTextInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should attach click event to encoded-to-text button", () => {
      encodingsInterface.setupEventListeners();
      jest.spyOn(encodingsInterface, "convertEncodedToText");

      const encodedToTextBtn = document.getElementById("encoded-to-text");
      encodedToTextBtn.click();

      expect(encodingsInterface.convertEncodedToText).toHaveBeenCalled();
    });

    it("should attach click event to clear button", () => {
      encodingsInterface.setupEventListeners();

      const clearBtn = document.getElementById("clear-all");
      clearBtn.click();

      expect(mockUIUtilsClearFields).toHaveBeenCalled();
    });

    it("should attach click event to copy button", () => {
      encodingsInterface.setupEventListeners();

      const copyBtn = document.getElementById("copy-result");
      copyBtn.click();

      expect(mockUIUtilsCopyResult).toHaveBeenCalled();
    });

    it("should handle missing text input element gracefully", () => {
      document.getElementById("text-input").remove();

      expect(() => {
        encodingsInterface.setupEventListeners();
      }).not.toThrow();
    });

    it("should handle missing encoded output element gracefully", () => {
      document.getElementById("encoded-output").remove();

      expect(() => {
        encodingsInterface.setupEventListeners();
      }).not.toThrow();
    });

    it("should handle missing button elements gracefully", () => {
      document.getElementById("text-to-encoded").remove();
      document.getElementById("encoded-to-text").remove();
      document.getElementById("clear-all").remove();
      document.getElementById("copy-result").remove();

      expect(() => {
        encodingsInterface.setupEventListeners();
      }).not.toThrow();
    });
  });

  // ============================================
  // 4. INTERFACE UPDATE TESTS
  // ============================================
  describe("updateInterface", () => {
    it("should update title and description for morse encoding", () => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();

      expect(mockUIUtilsUpdateElement).toHaveBeenCalledWith(
        "converter-title",
        expect.any(String)
      );
      expect(mockUIUtilsUpdateElement).toHaveBeenCalledWith(
        "converter-description",
        expect.any(String)
      );
    });

    it("should hide conversion type selector for morse encoding", () => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.updateInterface();

      const conversionTypeContainer = document.getElementById(
        "conversion-type-container"
      );
      expect(conversionTypeContainer.style.display).toBe("none");
    });

    it("should show conversion type selector for binary encoding", () => {
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.updateInterface();

      const conversionTypeContainer = document.getElementById(
        "conversion-type-container"
      );
      expect(conversionTypeContainer.style.display).toBe("block");
      expect(
        mockDropdownManagerUpdateConversionTypeOptions
      ).toHaveBeenCalledWith(encodingsInterface);
    });

    it("should show conversion type selector for hex encoding", () => {
      encodingsInterface.currentEncoding = "hex";
      encodingsInterface.updateInterface();

      const conversionTypeContainer = document.getElementById(
        "conversion-type-container"
      );
      expect(conversionTypeContainer.style.display).toBe("block");
    });

    it("should show conversion type selector for braille encoding", () => {
      encodingsInterface.currentEncoding = "braille";
      encodingsInterface.updateInterface();

      const conversionTypeContainer = document.getElementById(
        "conversion-type-container"
      );
      expect(conversionTypeContainer.style.display).toBe("block");
    });

    it("should call updateLabelsForConversionType", () => {
      encodingsInterface.updateInterface();

      expect(mockUIUtilsUpdateLabelsForConversionType).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should call updatePlaceholders", () => {
      encodingsInterface.updateInterface();

      expect(mockUIUtilsUpdatePlaceholders).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should handle unknown encoding gracefully", () => {
      encodingsInterface.currentEncoding = "unknown";

      expect(() => {
        encodingsInterface.updateInterface();
      }).not.toThrow();
    });

    it("should handle missing conversion type container gracefully", () => {
      document.getElementById("conversion-type-container").remove();

      expect(() => {
        encodingsInterface.updateInterface();
      }).not.toThrow();
    });
  });

  // ============================================
  // 5. LABEL UPDATE TESTS
  // ============================================
  describe("updateLabelsForConversionType", () => {
    it("should delegate to UIUtils.updateLabelsForConversionType", () => {
      encodingsInterface.updateLabelsForConversionType();

      expect(mockUIUtilsUpdateLabelsForConversionType).toHaveBeenCalledWith(
        encodingsInterface
      );
    });
  });

  // ============================================
  // 6. CLEAR FIELDS TESTS
  // ============================================
  describe("clearFields", () => {
    it("should delegate to UIUtils.clearFields", () => {
      encodingsInterface.clearFields();

      expect(mockUIUtilsClearFields).toHaveBeenCalled();
    });
  });

  // ============================================
  // 7. CONVERT ENCODED TO TEXT TESTS
  // ============================================
  describe("convertEncodedToText", () => {
    it("should show alert for braille contractions", () => {
      encodingsInterface.currentEncoding = "braille";
      encodingsInterface.currentConversionType = "braille2_contractions";

      encodingsInterface.convertEncodedToText();

      expect(global.alert).toHaveBeenCalledWith(
        "Braille with contractions cannot be converted back to text accurately. This is a one-way conversion only."
      );
      expect(mockConversionHandlerHandleEncodedInput).not.toHaveBeenCalled();
    });

    it("should not show alert for braille without contractions", () => {
      encodingsInterface.currentEncoding = "braille";
      encodingsInterface.currentConversionType = "braille1";

      encodingsInterface.convertEncodedToText();

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should convert morse code without alert", () => {
      encodingsInterface.currentEncoding = "morse";
      encodingsInterface.currentConversionType = "text";

      encodingsInterface.convertEncodedToText();

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should convert binary without alert", () => {
      encodingsInterface.currentEncoding = "binary";
      encodingsInterface.currentConversionType = "number";

      encodingsInterface.convertEncodedToText();

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });

    it("should convert hex without alert", () => {
      encodingsInterface.currentEncoding = "hex";
      encodingsInterface.currentConversionType = "text";

      encodingsInterface.convertEncodedToText();

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockConversionHandlerHandleEncodedInput).toHaveBeenCalledWith(
        encodingsInterface
      );
    });
  });
});
