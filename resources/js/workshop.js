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

/**
 * Manage button loading states
 */
function setLoading(button, isLoading) {
  button.disabled = isLoading;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.classList.add("loading");

    // Add spinner or loading text
    const spinner = "⟳ ";
    button.textContent = spinner + "Translating...";
  } else {
    button.classList.remove("loading");
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

/**
 * Show error messages to user
 */
function showError(message) {
  // Create a simple toast notification
  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 4 seconds
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

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/**
 * Text to Braille conversion
 */
textToEncodedBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();

  if (!text) {
    showError("Please enter some text to translate");
    return;
  }

  setLoading(textToEncodedBtn, true);

  try {
    const braille = await textToBrailleLLM(text);
    encodedOutput.value = braille;
    showSuccess("Translation complete!");
  } catch (error) {
    console.error("Translation error:", error);
    showError(error.message);
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
    showError("Please enter some Braille to translate");
    return;
  }

  setLoading(encodedToTextBtn, true);

  try {
    const text = await brailleToTextLLM(braille);
    textInput.value = text;
    showSuccess("Translation complete!");
  } catch (error) {
    console.error("Translation error:", error);
    showError(error.message);
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
