import {
  translateBrailleLLM,
  textToBrailleLLM,
  brailleToTextLLM,
} from "../braille-llm.js";

describe("Braille LLM Translation - Unit Tests", () => {
  describe("Input Validation", () => {
    it("should reject empty string input", async () => {
      await expect(translateBrailleLLM("")).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should reject whitespace-only input", async () => {
      await expect(translateBrailleLLM("   ")).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should reject null input", async () => {
      await expect(translateBrailleLLM(null)).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should reject undefined input", async () => {
      await expect(translateBrailleLLM(undefined)).rejects.toThrow(
        "Text cannot be empty",
      );
    });
  });

  describe("API Communication - Real API Calls", () => {
    // These tests make real API calls to the Cloudflare Worker
    // They verify the full integration works end-to-end

    it("should translate simple text to Braille", async () => {
      const response = await translateBrailleLLM("hello", "toBraille");

      // Verify response structure
      expect(response).toHaveProperty("result");
      expect(response).toHaveProperty("usage");
      expect(typeof response.result).toBe("string");
      expect(response.result.length).toBeGreaterThan(0);

      // Verify result contains Braille characters (Unicode range U+2800 to U+28FF)
      expect(response.result).toMatch(/^[⠀-⣿\s]+$/);

      // Verify usage stats
      expect(response.usage).toHaveProperty("totalTokens");
      expect(response.usage.totalTokens).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for API call

    it("should translate Braille back to text", async () => {
      const brailleInput = "⠓⠑⠇⠇⠕"; // "hello" in Braille

      const response = await translateBrailleLLM(brailleInput, "toText");

      // Verify response structure
      expect(response).toHaveProperty("result");
      expect(response).toHaveProperty("usage");
      expect(typeof response.result).toBe("string");
      expect(response.result.length).toBeGreaterThan(0);

      // Verify result contains English text (case-insensitive check)
      expect(response.result.toLowerCase()).toContain("hello");
    }, 30000);

    it("should handle text with numbers", async () => {
      const response = await translateBrailleLLM("test123", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
      // Braille uses number indicator before numbers
      expect(response.result).toMatch(/[⠀-⣿]/);
    }, 30000);

    it("should handle text with punctuation", async () => {
      const response = await translateBrailleLLM("Hello, world!", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
    }, 30000);

    it("should default to toBraille direction when not specified", async () => {
      const response = await translateBrailleLLM("test");

      expect(response).toHaveProperty("result");
      // Result should be Braille characters
      expect(response.result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);
  });

  describe("Convenience Functions - Real API Calls", () => {
    it("textToBrailleLLM should return only the result string", async () => {
      const result = await textToBrailleLLM("hello");

      // Should return string directly, not the full response object
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);

    it("brailleToTextLLM should return only the result string", async () => {
      const result = await brailleToTextLLM("⠓⠑⠇⠇⠕");

      // Should return string directly, not the full response object
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result.toLowerCase()).toContain("hello");
    }, 30000);
  });

  describe("Response Structure Validation", () => {
    it("should return usage statistics with correct properties", async () => {
      const response = await translateBrailleLLM("test", "toBraille");

      expect(response.usage).toHaveProperty("promptTokens");
      expect(response.usage).toHaveProperty("completionTokens");
      expect(response.usage).toHaveProperty("totalTokens");

      expect(typeof response.usage.promptTokens).toBe("number");
      expect(typeof response.usage.completionTokens).toBe("number");
      expect(typeof response.usage.totalTokens).toBe("number");

      expect(response.usage.totalTokens).toBe(
        response.usage.promptTokens + response.usage.completionTokens,
      );
    }, 30000);
  });

  describe("Edge Cases - Real API Calls", () => {
    it("should handle single character input", async () => {
      const response = await translateBrailleLLM("a", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
    }, 30000);

    it("should handle uppercase text", async () => {
      const response = await translateBrailleLLM("HELLO", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
      // Braille uses capital indicator for uppercase
      expect(response.result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);

    it("should handle mixed case text", async () => {
      const response = await translateBrailleLLM("Hello World", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
    }, 30000);

    it("should trim whitespace from input", async () => {
      const response = await translateBrailleLLM("  hello  ", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response.result.length).toBeGreaterThan(0);
    }, 30000);
  });
});
