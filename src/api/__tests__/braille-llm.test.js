import {
  translateBrailleLLM,
  textToBrailleLLM,
  brailleToTextLLM,
} from "../braille-llm.js";

describe("Braille LLM Translation - Unit Tests", () => {
  /**
   * Input Validation Tests
   * These test the validation logic WITHOUT hitting the API
   * They should run in milliseconds
   */
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

    it("should reject tab-only input", async () => {
      await expect(translateBrailleLLM("\t\t")).rejects.toThrow(
        "Text cannot be empty",
      );
    });

    it("should reject newline-only input", async () => {
      await expect(translateBrailleLLM("\n\n")).rejects.toThrow(
        "Text cannot be empty",
      );
    });
  });

  /**
   * Smoke Test - Single API call to verify basic connectivity
   * This is the ONLY test in unit tests that hits the API
   */
  describe("API Smoke Test", () => {
    it("should successfully connect to the API and get a response", async () => {
      const response = await translateBrailleLLM("test", "toBraille");

      expect(response).toHaveProperty("result");
      expect(response).toHaveProperty("usage");
      expect(typeof response.result).toBe("string");
      expect(response.result.length).toBeGreaterThan(0);
    }, 30000);
  });
});
