// Manages custom dropdown functionality
export class DropdownManager {
  // Setup main encoding dropdown
  static setupEncodingDropdown(encodingsInterface) {
    const dropdown = document.getElementById("encoding-dropdown");
    const dropdownSelected = document.getElementById("dropdown-selected");
    const dropdownOptions = document.getElementById("dropdown-options");
    const options = document.querySelectorAll(
      "#encoding-dropdown .dropdown-option"
    );

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
        encodingsInterface.currentEncoding = value;

        // Reset conversion type to appropriate default for the encoding
        if (value === "morse") {
          encodingsInterface.currentConversionType = "text";
        } else if (value === "binary" || value === "hex") {
          encodingsInterface.currentConversionType = "number"; // or "text", your choice
        } else if (value === "braille") {
          encodingsInterface.currentConversionType = "braille1";
        }

        encodingsInterface.updateInterface();
        encodingsInterface.clearFields();
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

  // Setup conversion type dropdown
  static setupConversionDropdown(encodingsInterface) {
    const dropdown = document.getElementById("conversion-type-dropdown");
    const dropdownSelected = document.getElementById(
      "conversion-dropdown-selected"
    );
    const dropdownOptions = document.getElementById(
      "conversion-dropdown-options"
    );

    if (!dropdown || !dropdownSelected || !dropdownOptions) return;

    // Remove existing event listeners by cloning
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
        encodingsInterface.currentConversionType = value;
        encodingsInterface.updateLabelsForConversionType();
        encodingsInterface.clearFields();
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

  // Update conversion type dropdown options
  static updateConversionTypeOptions(encodingsInterface) {
    const conversionDropdownSelected = document.getElementById(
      "conversion-dropdown-selected"
    );
    const conversionDropdownOptions = document.getElementById(
      "conversion-dropdown-options"
    );

    if (!conversionDropdownSelected || !conversionDropdownOptions) return;

    // Clear existing options
    conversionDropdownOptions.innerHTML = "";

    if (encodingsInterface.currentEncoding === "braille") {
      // Braille-specific options
      const options = [
        { value: "braille1", text: "Braille 1", active: true },
        { value: "braille2", text: "Braille 2", active: false },
        {
          value: "braille2_contractions",
          text: "Braille 2 + Contractions",
          active: false,
        },
      ];

      options.forEach((opt) => {
        const option = document.createElement("div");
        option.className = opt.active
          ? "dropdown-option active"
          : "dropdown-option";
        option.setAttribute("data-value", opt.value);
        option.textContent = opt.text;
        conversionDropdownOptions.appendChild(option);
      });

      encodingsInterface.currentConversionType = "braille1";
      conversionDropdownSelected.querySelector("span").textContent =
        "Braille 1";
    } else {
      // Binary/Hex options
      const options = [
        { value: "number", text: "Numbers", active: true },
        { value: "text", text: "Text", active: false },
      ];

      options.forEach((opt) => {
        const option = document.createElement("div");
        option.className = opt.active
          ? "dropdown-option active"
          : "dropdown-option";
        option.setAttribute("data-value", opt.value);
        option.textContent = opt.text;
        conversionDropdownOptions.appendChild(option);
      });

      encodingsInterface.currentConversionType = "number";
      conversionDropdownSelected.querySelector("span").textContent = "Numbers";
    }

    // Re-setup event listeners for new options
    this.setupConversionDropdown(encodingsInterface);
  }
}
