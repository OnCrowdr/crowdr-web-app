import { useState } from "react";
import { useToast } from "./useToast";

function useClipboard({ timeout = 2000 } = {}) {
  const toast = useToast();
  const [error, setError] = useState<string | Error | null | undefined>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyTimeout, setCopyTimeout] = useState<number | undefined | any>(
    undefined
  );

  const handleCopyResult = (isCopied: boolean) => {
    clearTimeout(copyTimeout);
    toast({
      title: "Copy",
      body: isCopied ? "Copied to clipboard!" : "Error copying to clipboard",
      type: isCopied ? "success" : "error"
    });
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(isCopied);
  };

  const copy = (value: string) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(value)
        .then(() => handleCopyResult(true))
        .catch((err) => setError(err));
    } else setError(new Error("Error: navigator.clipboard is not supported"));
  };

  const reset = () => {
    setError(null);
    setCopied(false);
    clearTimeout(copyTimeout);
  };

  return {
    copy,
    reset,
    error,
    copied
  };
}

export default useClipboard;
