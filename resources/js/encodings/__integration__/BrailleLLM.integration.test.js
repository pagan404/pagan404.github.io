import {
  translateBrailleLLM,
  textToBrailleLLM,
  brailleToTextLLM,
} from "../../../../src/api/braille-llm.js";

/**
 * Integration tests for the LLM-based Braille translator.
 *
 * These tests make REAL API calls to the Cloudflare Worker and OpenAI backend.
 * They verify the full end-to-end translation pipeline works correctly.
 *
 * Note: These tests cost real money to run (OpenAI API charges).
 * Run sparingly or exclude from CI pipelines if cost is a concern.
 */
describe("Braille LLM Integration Tests", () => {
  describe("Round-Trip Translation", () => {
    it("should preserve meaning when translating text to Braille and back", async () => {
      const originalText = "hello world";

      // Text -> Braille
      const brailleResult = await textToBrailleLLM(originalText);
      expect(brailleResult).toMatch(/^[⠀-⣿\s]+$/);

      // Braille -> Text
      const textResult = await brailleToTextLLM(brailleResult);

      // The round-trip should preserve the original meaning
      // Case-insensitive comparison since LLM might change capitalization
      expect(textResult.toLowerCase()).toContain("hello");
      expect(textResult.toLowerCase()).toContain("world");
    }, 60000); // 60 second timeout for two API calls

    it("should handle sentence round-trip translation", async () => {
      const originalText = "The quick brown fox";

      // Text -> Braille
      const brailleResult = await textToBrailleLLM(originalText);
      expect(brailleResult.length).toBeGreaterThan(0);

      // Braille -> Text
      const textResult = await brailleToTextLLM(brailleResult);

      // Verify key words are preserved
      const resultLower = textResult.toLowerCase();
      expect(resultLower).toContain("quick");
      expect(resultLower).toContain("brown");
      expect(resultLower).toContain("fox");
    }, 60000);
  });

  describe("Translation Quality", () => {
    it("should produce non-empty Braille output for valid English input", async () => {
      const testCases = ["hello", "Hello World", "test 123", "Good morning!"];

      for (const input of testCases) {
        const result = await textToBrailleLLM(input);
        expect(result.length).toBeGreaterThan(0);
        // All output should be valid Braille Unicode characters
        expect(result).toMatch(/^[⠀-⣿\s]+$/);
      }
    }, 120000); // 2 minute timeout for multiple API calls

    it("should produce non-empty English output for valid Braille input", async () => {
      const testCases = [
        "⠓⠑⠇⠇⠕", // hello
        "⠞⠑⠎⠞", // test
        "⠛⠕⠕⠙", // good
      ];

      for (const input of testCases) {
        const result = await brailleToTextLLM(input);
        expect(result.length).toBeGreaterThan(0);
        // Output should contain ASCII characters (English text)
        expect(result).toMatch(/[a-zA-Z]/);
      }
    }, 90000);
  });

  describe("Special Characters Handling", () => {
    it("should handle numbers in translation", async () => {
      const result = await textToBrailleLLM("123");

      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);

    it("should handle punctuation in translation", async () => {
      const result = await textToBrailleLLM("Hello, how are you?");

      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);

    it("should handle mixed content (letters, numbers, punctuation)", async () => {
      const result = await textToBrailleLLM("Order #123 is ready!");

      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);
  });

  describe("API Response Consistency", () => {
    it("should consistently return valid response structure", async () => {
      // Run same translation multiple times to verify consistency
      const promises = Array(3)
        .fill(null)
        .map(() => translateBrailleLLM("consistency test", "toBraille"));

      const results = await Promise.all(promises);

      for (const response of results) {
        // Verify structure
        expect(response).toHaveProperty("result");
        expect(response).toHaveProperty("usage");
        expect(response.usage).toHaveProperty("totalTokens");

        // Verify types
        expect(typeof response.result).toBe("string");
        expect(typeof response.usage.totalTokens).toBe("number");

        // Verify non-empty
        expect(response.result.length).toBeGreaterThan(0);
        expect(response.usage.totalTokens).toBeGreaterThan(0);
      }
    }, 90000);
  });

  describe("Error Handling", () => {
    it("should reject empty input before making API call", async () => {
      await expect(translateBrailleLLM("")).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should reject whitespace-only input before making API call", async () => {
      await expect(translateBrailleLLM("   ")).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should handle invalid direction parameter gracefully", async () => {
      // The API should return an error for invalid direction
      await expect(
        translateBrailleLLM("test", "invalidDirection"),
      ).rejects.toThrow();
    }, 30000);
  });

  describe("Performance Characteristics", () => {
    it("should complete translation within reasonable time", async () => {
      const startTime = Date.now();
      await textToBrailleLLM("quick performance test");
      const endTime = Date.now();

      const duration = endTime - startTime;
      // Translation should complete within 25 seconds (timeout is 25s on worker)
      expect(duration).toBeLessThan(25000);
    }, 30000);

    it("should handle longer text input", async () => {
      const longerText =
        "This is a longer piece of text that contains multiple sentences. It should still translate correctly within the time limit.";

      const result = await textToBrailleLLM(longerText);

      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[⠀-⣿\s]+$/);
    }, 30000);
  });
});
