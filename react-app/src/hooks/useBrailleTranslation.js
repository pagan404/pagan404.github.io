import { useState } from "react";
import { textToBrailleLLM, brailleToTextLLM } from "../api/braille-llm";

export function useBrailleTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const translateToBraille = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await textToBrailleLLM(text);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const translateToText = async (braille) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await brailleToTextLLM(braille);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translateToBraille,
    translateToText,
    isLoading,
    error,
  };
}
