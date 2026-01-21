/**
 * @jest-environment jsdom
 *
 * REFACTORED UNIT TESTS - STATE-BASED APPROACH
 * ==============================================
 * These tests focus on DOM STATE CHANGES, not interaction verification.
 * They check actual CSS classes, text content, and interface properties.
 *
 * Key principles:
 * 1. Assert on DOM state (classList, textContent, active classes)
 * 2. Check interface property changes (currentEncoding, currentConversionType)
 * 3. Verify keyboard interactions by checking resulting DOM state
 * 4. Tests survive refactoring because they only care about visible outcomes
 *
 * These tests will pass as long as:
 * - Dropdowns open/close correctly (classList.contains('open'))
 * - Selected text updates when options are clicked
 * - Active class moves to correct option
 * - Interface properties reflect the selected state
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { DropdownManager } from "../DropdownManager.js";

describe("DropdownManager", () => {
  let mockEncodingsInterface;

  // Setup: Create mock DOM before each test
  beforeEach(() => {
    // Create a minimal DOM structure that DropdownManager expects
    document.body.innerHTML = `
      <div id="encoding-dropdown">
        <div id="dropdown-selected" tabindex="0">
          <span>Morse Code</span>
        </div>
        <div id="dropdown-options">
          <div class="dropdown-option active" data-value="morse">Morse Code</div>
          <div class="dropdown-option" data-value="binary">Binary</div>
          <div class="dropdown-option" data-value="hex">Hexadecimal</div>
          <div class="dropdown-option" data-value="braille">Braille</div>
        </div>
      </div>
      
      <div id="conversion-type-dropdown">
        <div id="conversion-dropdown-selected" tabindex="0">
          <span>Numbers</span>
        </div>
        <div id="conversion-dropdown-options">
          <div class="dropdown-option active" data-value="number">Numbers</div>
          <div class="dropdown-option" data-value="text">Text</div>
        </div>
      </div>
    `;

    // Create mock interface
    mockEncodingsInterface = {
      currentEncoding: "morse",
      currentConversionType: "text",
      updateInterface: jest.fn(),
      clearFields: jest.fn(),
      updateLabelsForConversionType: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ============================================
  // 1. ENCODING DROPDOWN SETUP TESTS
  // ============================================
  describe("setupEncodingDropdown", () => {
    it("should setup encoding dropdown successfully", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      expect(dropdown).toBeTruthy();
      expect(dropdownSelected.getAttribute("tabindex")).toBe("0");
    });

    it("should toggle dropdown open state on click", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      expect(dropdown.classList.contains("open")).toBe(false);

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should close dropdown when clicking outside", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      // Click outside
      document.body.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should update encoding when option is selected", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const binaryOption = document.querySelector('[data-value="binary"]');
      binaryOption.click();

      // STATE ASSERTIONS: Check interface state changes
      expect(mockEncodingsInterface.currentEncoding).toBe("binary");
      expect(mockEncodingsInterface.currentConversionType).toBe("number");
    });

    it("should update selected text when option is clicked", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdownSelected = document.getElementById("dropdown-selected");
      const hexOption = document.querySelector('[data-value="hex"]');

      hexOption.click();

      expect(dropdownSelected.querySelector("span").textContent).toBe(
        "Hexadecimal",
      );
    });

    it("should update active class when option is selected", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const morseOption = document.querySelector('[data-value="morse"]');
      const binaryOption = document.querySelector('[data-value="binary"]');

      expect(morseOption.classList.contains("active")).toBe(true);
      expect(binaryOption.classList.contains("active")).toBe(false);

      binaryOption.click();

      expect(morseOption.classList.contains("active")).toBe(false);
      expect(binaryOption.classList.contains("active")).toBe(true);
    });

    it("should close dropdown after selecting option", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");
      const binaryOption = document.querySelector('[data-value="binary"]');

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      binaryOption.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should set correct conversion type for morse encoding", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const morseOption = document.querySelector('[data-value="morse"]');
      morseOption.click();

      expect(mockEncodingsInterface.currentConversionType).toBe("text");
    });

    it("should set correct conversion type for binary encoding", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const binaryOption = document.querySelector('[data-value="binary"]');
      binaryOption.click();

      expect(mockEncodingsInterface.currentConversionType).toBe("number");
    });

    it("should set correct conversion type for hex encoding", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const hexOption = document.querySelector('[data-value="hex"]');
      hexOption.click();

      expect(mockEncodingsInterface.currentConversionType).toBe("number");
    });

    it("should set correct conversion type for braille encoding", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const brailleOption = document.querySelector('[data-value="braille"]');
      brailleOption.click();

      expect(mockEncodingsInterface.currentConversionType).toBe("braille1");
    });

    it("should handle keyboard Enter key", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      dropdownSelected.dispatchEvent(enterEvent);

      expect(dropdown.classList.contains("open")).toBe(true);
    });

    it("should handle keyboard Space key", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      dropdownSelected.dispatchEvent(spaceEvent);

      expect(dropdown.classList.contains("open")).toBe(true);
    });

    it("should handle keyboard Escape key", () => {
      DropdownManager.setupEncodingDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("encoding-dropdown");
      const dropdownSelected = document.getElementById("dropdown-selected");

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      dropdownSelected.dispatchEvent(escapeEvent);

      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should handle missing DOM elements gracefully", () => {
      document.getElementById("encoding-dropdown").remove();

      expect(() => {
        DropdownManager.setupEncodingDropdown(mockEncodingsInterface);
      }).not.toThrow();
    });
  });

  // ============================================
  // 2. CONVERSION DROPDOWN SETUP TESTS
  // ============================================
  describe("setupConversionDropdown", () => {
    it("should setup conversion dropdown successfully", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      expect(dropdown).toBeTruthy();
      expect(dropdownSelected.getAttribute("tabindex")).toBe("0");
    });

    it("should toggle dropdown open state on click", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      expect(dropdown.classList.contains("open")).toBe(false);

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should close dropdown when clicking outside", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      document.body.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should update conversion type when option is selected", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const textOption = document.querySelector(
        '#conversion-dropdown-options [data-value="text"]',
      );
      textOption.click();

      // STATE ASSERTION: Interface property updated
      expect(mockEncodingsInterface.currentConversionType).toBe("text");
    });

    it("should update selected text when option is clicked", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );
      const textOption = document.querySelector(
        '#conversion-dropdown-options [data-value="text"]',
      );

      textOption.click();

      expect(dropdownSelected.querySelector("span").textContent).toBe("Text");
    });

    it("should update active class when option is selected", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const numberOption = document.querySelector(
        '#conversion-dropdown-options [data-value="number"]',
      );
      const textOption = document.querySelector(
        '#conversion-dropdown-options [data-value="text"]',
      );

      expect(numberOption.classList.contains("active")).toBe(true);
      expect(textOption.classList.contains("active")).toBe(false);

      textOption.click();

      expect(numberOption.classList.contains("active")).toBe(false);
      expect(textOption.classList.contains("active")).toBe(true);
    });

    it("should close dropdown after selecting option", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );
      const textOption = document.querySelector(
        '#conversion-dropdown-options [data-value="text"]',
      );

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      textOption.click();
      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should handle keyboard Enter key", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      dropdownSelected.dispatchEvent(enterEvent);

      expect(dropdown.classList.contains("open")).toBe(true);
    });

    it("should handle keyboard Space key", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      dropdownSelected.dispatchEvent(spaceEvent);

      expect(dropdown.classList.contains("open")).toBe(true);
    });

    it("should handle keyboard Escape key", () => {
      DropdownManager.setupConversionDropdown(mockEncodingsInterface);

      const dropdown = document.getElementById("conversion-type-dropdown");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );

      dropdownSelected.click();
      expect(dropdown.classList.contains("open")).toBe(true);

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      dropdownSelected.dispatchEvent(escapeEvent);

      expect(dropdown.classList.contains("open")).toBe(false);
    });

    it("should handle missing DOM elements gracefully", () => {
      document.getElementById("conversion-type-dropdown").remove();

      expect(() => {
        DropdownManager.setupConversionDropdown(mockEncodingsInterface);
      }).not.toThrow();
    });
  });

  // ============================================
  // 3. CONVERSION TYPE OPTIONS UPDATE TESTS
  // ============================================
  describe("updateConversionTypeOptions", () => {
    it("should update options for braille encoding", () => {
      mockEncodingsInterface.currentEncoding = "braille";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      const options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options.length).toBe(3);
      expect(options[0].getAttribute("data-value")).toBe("braille1");
      expect(options[1].getAttribute("data-value")).toBe("braille2");
      expect(options[2].getAttribute("data-value")).toBe(
        "braille2_contractions",
      );
    });

    it("should update options for binary encoding", () => {
      mockEncodingsInterface.currentEncoding = "binary";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      const options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options.length).toBe(2);
      expect(options[0].getAttribute("data-value")).toBe("number");
      expect(options[1].getAttribute("data-value")).toBe("text");
    });

    it("should update options for hex encoding", () => {
      mockEncodingsInterface.currentEncoding = "hex";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      const options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options.length).toBe(2);
      expect(options[0].getAttribute("data-value")).toBe("number");
      expect(options[1].getAttribute("data-value")).toBe("text");
    });

    it("should set correct default for braille encoding", () => {
      mockEncodingsInterface.currentEncoding = "braille";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      expect(mockEncodingsInterface.currentConversionType).toBe("braille1");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );
      expect(dropdownSelected.querySelector("span").textContent).toBe(
        "Braille 1",
      );
    });

    it("should set correct default for binary/hex encoding", () => {
      mockEncodingsInterface.currentEncoding = "binary";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      expect(mockEncodingsInterface.currentConversionType).toBe("number");
      const dropdownSelected = document.getElementById(
        "conversion-dropdown-selected",
      );
      expect(dropdownSelected.querySelector("span").textContent).toBe(
        "Numbers",
      );
    });

    it("should mark first option as active for braille", () => {
      mockEncodingsInterface.currentEncoding = "braille";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      const options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options[0].classList.contains("active")).toBe(true);
      expect(options[1].classList.contains("active")).toBe(false);
      expect(options[2].classList.contains("active")).toBe(false);
    });

    it("should mark first option as active for binary/hex", () => {
      mockEncodingsInterface.currentEncoding = "binary";

      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      const options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options[0].classList.contains("active")).toBe(true);
      expect(options[1].classList.contains("active")).toBe(false);
    });

    it("should clear existing options before adding new ones", () => {
      mockEncodingsInterface.currentEncoding = "binary";
      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      let options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options.length).toBe(2);

      mockEncodingsInterface.currentEncoding = "braille";
      DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);

      options = document.querySelectorAll(
        "#conversion-dropdown-options .dropdown-option",
      );
      expect(options.length).toBe(3);
    });

    it("should handle missing DOM elements gracefully", () => {
      document.getElementById("conversion-dropdown-selected").remove();

      expect(() => {
        DropdownManager.updateConversionTypeOptions(mockEncodingsInterface);
      }).not.toThrow();
    });
  });
});
