import { useCallback, useState } from "react";
import { isWebAuthnSupported } from "../utils/webAuthnUtils";

export const useWebAuthn = () => {
  const [isSupported] = useState(isWebAuthnSupported());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleWebAuthnOperation = useCallback(
    async (operation) => {
      if (!isSupported) {
        setError("WebAuthn is not supported in this browser");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        setError(err.message || "WebAuthn operation failed");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported]
  );

  return {
    isSupported,
    isLoading,
    error,
    clearError,
    handleWebAuthnOperation,
  };
};
