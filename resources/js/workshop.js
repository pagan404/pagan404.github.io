import {
  textToBrailleLLM,
  brailleToTextLLM,
} from "../../src/api/braille-llm.js";

// Get DOM elements
const textInput = document.getElementById("text-input");
const encodedOutput = document.getElementById("encoded-output");
const textToEncodedBtn = document.getElementById("text-to-encoded");
const encodedToTextBtn = document.getElementById("encoded-to-text");
const clearAllBtn = document.getElementById("clear-all");
const copyResultBtn = document.getElementById("copy-result");

// Character limit
const MAX_CHARS = 500;

/**
 * Validate input length
 */
function validateInputLength(textarea, outputTextarea) {
  if (textarea.value.length > MAX_CHARS) {
    outputTextarea.value = `Error: Input too large (max ${MAX_CHARS} characters)`;
    return false;
  }
  return true;
}

/**
 * Manage button loading states
 */
function setLoading(button, isLoading) {
  button.disabled = isLoading;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.classList.add("loading");

    const spinner = "⟳ ";
    button.textContent = spinner + "Translating...";
  } else {
    button.classList.remove("loading");
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

/**
 * Position toast above footer dynamically
 */
function positionToast(toast) {
  const footer = document.querySelector("footer");
  if (!footer) return;

  const footerRect = footer.getBoundingClientRect();
  const footerTop = footerRect.top;
  const windowHeight = window.innerHeight;
  const offset = 20; // 20px gap above footer

  // Calculate bottom position: distance from bottom of viewport to footer top + offset
  const bottomPosition = windowHeight - footerTop + offset;

  // Use a minimum of 20px on small screens
  toast.style.bottom = `${Math.max(bottomPosition, 20)}px`;
}

/**
 * Show error messages to user
 */
function showError(message) {
  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Position above footer
  positionToast(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Show success messages to user
 */
function showSuccess(message) {
  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Position above footer
  positionToast(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Reposition toasts on window resize
window.addEventListener("resize", () => {
  document
    .querySelectorAll(".error-toast, .success-toast")
    .forEach(positionToast);
});

// Add input event listeners for real-time validation
textInput.addEventListener("input", () => {
  validateInputLength(textInput, encodedOutput);
});

encodedOutput.addEventListener("input", () => {
  validateInputLength(encodedOutput, textInput);
});

/**
 * Text to Braille conversion
 */
textToEncodedBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();

  if (!text) {
    encodedOutput.value = "";
    return;
  }

  // Validate input length
  if (!validateInputLength(textInput, encodedOutput)) {
    return;
  }

  setLoading(textToEncodedBtn, true);

  try {
    const braille = await textToBrailleLLM(text);
    encodedOutput.value = braille;
    showSuccess("Translation complete!");
  } catch (error) {
    console.error("Translation error:", error);
    encodedOutput.value = "Error: " + error.message;
  } finally {
    setLoading(textToEncodedBtn, false);
  }
});

/**
 * Braille to Text conversion
 */
encodedToTextBtn.addEventListener("click", async () => {
  const braille = encodedOutput.value.trim();

  if (!braille) {
    textInput.value = "";
    return;
  }

  // Validate input length
  if (!validateInputLength(encodedOutput, textInput)) {
    return;
  }

  setLoading(encodedToTextBtn, true);

  try {
    const text = await brailleToTextLLM(braille);
    textInput.value = text;
    showSuccess("Translation complete!");
  } catch (error) {
    console.error("Translation error:", error);
    textInput.value = "Error: " + error.message;
  } finally {
    setLoading(encodedToTextBtn, false);
  }
});

/**
 * Clear all inputs
 */
clearAllBtn.addEventListener("click", () => {
  textInput.value = "";
  encodedOutput.value = "";
  showSuccess("Cleared!");
});

/**
 * Copy result to clipboard
 */
copyResultBtn.addEventListener("click", async () => {
  const result = encodedOutput.value;

  if (!result) {
    showError("Nothing to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(result);
    showSuccess("Copied to clipboard!");
  } catch (error) {
    console.error("Copy error:", error);
    showError("Failed to copy to clipboard");
  }
});
