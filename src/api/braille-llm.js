/**
 * Client-side module for LLM-based Braille translation
 * Communicates with Cloudflare Worker proxy
 */

// Configuration
const WORKER_URL = "https://braille-translator.saraspap.workers.dev";
// For local development: 'http://localhost:8787'

/**
 * Translate text to/from Braille using LLM
 * @param {string} text - Text to translate
 * @param {'toBraille'|'toText'} direction - Translation direction
 * @returns {Promise<{result: string, usage: object}>} Translation result and token usage
 */
export async function translateBrailleLLM(text, direction = "toBraille") {
  if (!text || text.trim() === "") {
    throw new Error("Text cannot be empty");
  }

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        direction: direction,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    // Network errors, parsing errors, etc.
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
}

/**
 * Translate text to Braille
 * @param {string} text - Plain text to translate
 * @returns {Promise<string>} Braille translation
 */
export async function textToBrailleLLM(text) {
  const response = await translateBrailleLLM(text, "toBraille");
  return response.result;
}

/**
 * Translate Braille to text
 * @param {string} braille - Braille text to translate
 * @returns {Promise<string>} Plain text translation
 */
export async function brailleToTextLLM(braille) {
  const response = await translateBrailleLLM(braille, "toText");
  return response.result;
}
