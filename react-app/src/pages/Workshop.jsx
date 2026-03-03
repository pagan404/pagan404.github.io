import { useState } from "react";
import { useBrailleTranslation } from "../hooks/useBrailleTranslation";
import { useToast } from "../hooks/useToast";
import { Toast, Button } from "../components/ui";

const MAX_CHARS = 500;

function Workshop() {
  const [textInput, setTextInput] = useState("");
  const [brailleOutput, setBrailleOutput] = useState("");
  const { translateToBraille, translateToText, isLoading } =
    useBrailleTranslation();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const validateLength = (value, outputSetter) => {
    if (value.length > MAX_CHARS) {
      outputSetter(`Error: Input too large (max ${MAX_CHARS} characters)`);
      return false;
    }
    return true;
  };

  const handleTextToBraille = async () => {
    const text = textInput.trim();
    if (!text) {
      setBrailleOutput("");
      return;
    }

    if (!validateLength(text, setBrailleOutput)) return;

    try {
      const result = await translateToBraille(text);
      setBrailleOutput(result);
      showSuccess("Translation complete!");
    } catch (error) {
      setBrailleOutput(`Error: ${error.message}`);
    }
  };

  const handleBrailleToText = async () => {
    const braille = brailleOutput.trim();
    if (!braille) {
      setTextInput("");
      return;
    }

    if (!validateLength(braille, setTextInput)) return;

    try {
      const result = await translateToText(braille);
      setTextInput(result);
      showSuccess("Translation complete!");
    } catch (error) {
      setTextInput(`Error: ${error.message}`);
    }
  };

  const handleClear = () => {
    setTextInput("");
    setBrailleOutput("");
    showSuccess("Cleared!");
  };

  const handleCopy = async () => {
    if (!brailleOutput) {
      showError("Nothing to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(brailleOutput);
      showSuccess("Copied to clipboard!");
    } catch {
      showError("Failed to copy to clipboard");
    }
  };

  const handleTextInputChange = (e) => {
    const value = e.target.value;
    setTextInput(value);
    validateLength(value, setBrailleOutput);
  };

  const handleBrailleOutputChange = (e) => {
    const value = e.target.value;
    setBrailleOutput(value);
    validateLength(value, setTextInput);
  };

  return (
    <div className="workshop">
      <div className="encodings-container">
        {/* Page header - INSIDE encodings-container like original */}
        <div className="page-header">
          <h1>Braille Converter</h1>
          <p>Convert text to Braille and back using the tool below.</p>
        </div>

        {/* Converter Interface */}
        <div className="converter-container">
          <div className="converter-help">
            <strong>How to use:</strong>
            <span>
              Enter text in the left box to see encoded text, or enter encoded
              text in the right box to see decoded text.
            </span>
          </div>

          <div className="converter-warning">
            <strong>⚠️ Note:</strong> The tool below uses AI for translating
            text and Braille. Please take note that the translations may not be
            entirely accurate.
          </div>

          {/* Use original class: converter-grid */}
          <div className="converter-grid">
            {/* Use original class: input-section */}
            <div className="input-section">
              <h3>Text Input</h3>
              <textarea
                id="text-input"
                className="converter-textarea"
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="Enter your text here..."
              />
            </div>

            {/* Use original class: output-section */}
            <div className="output-section">
              <h3>Braille Output</h3>
              <div className="encoded-output-wrapper">
                <textarea
                  id="braille-output"
                  className="converter-textarea"
                  value={brailleOutput}
                  onChange={handleBrailleOutputChange}
                  placeholder="Encoded text will appear here..."
                />
              </div>
            </div>
          </div>

          {/* Use original class: converter-controls */}
          <div className="converter-controls">
            <Button
              variant="primary"
              onClick={handleTextToBraille}
              loading={isLoading}
              disabled={isLoading}
            >
              Text → Braille
            </Button>
            <Button
              variant="secondary"
              onClick={handleBrailleToText}
              loading={isLoading}
              disabled={isLoading}
            >
              Braille → Text
            </Button>
            <Button variant="danger" onClick={handleClear}>
              Clear All
            </Button>
            <Button variant="success" onClick={handleCopy}>
              Copy Result
            </Button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default Workshop;
