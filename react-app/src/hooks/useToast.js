import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showSuccess = useCallback((message) => {
    setToast({ message, type: "success" });
  }, []);

  const showError = useCallback((message) => {
    setToast({ message, type: "error" });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showSuccess, showError, hideToast };
}
