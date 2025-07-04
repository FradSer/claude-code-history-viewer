import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Check, X, Clipboard } from "lucide-react";

interface CopyState {
  [key: string]: "idle" | "copying" | "success" | "error";
}

export const useCopyButton = () => {
  const { t } = useTranslation(['common']);
  // Clipboard copy state management
  const [copyStates, setCopyStates] = useState<CopyState>({});

  // Clipboard copy helper function
  const copyToClipboard = async (text: string, id: string) => {
    setCopyStates((prev) => ({ ...prev, [id]: "copying" }));

    try {
      await navigator.clipboard.writeText(text);
      setCopyStates((prev) => ({ ...prev, [id]: "success" }));

      // Reset state after 2 seconds
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [id]: "idle" }));
      }, 2000);
    } catch (error) {
      console.error(t('common:clipboardCopyFailed'), error);
      setCopyStates((prev) => ({ ...prev, [id]: "error" }));

      // Reset state after 2 seconds
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [id]: "idle" }));
      }, 2000);
    }
  };

  // Copy button rendering helper
  const renderCopyButton = (
    text: string,
    id: string,
    label: string = t('common:copy')
  ) => {
    const state = copyStates[id] || "idle";

    return (
      <button
        onClick={() => copyToClipboard(text, id)}
        disabled={state === "copying"}
        className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
          state === "success"
            ? "bg-green-100 text-green-700"
            : state === "error"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
        title={`${label}`}
      >
        {state === "copying" ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>{t('common:copying')}</span>
          </>
        ) : state === "success" ? (
          <>
            <Check className="w-3 h-3" />
            <span>{t('common:copied')}</span>
          </>
        ) : state === "error" ? (
          <>
            <X className="w-3 h-3" />
            <span>{t('common:copyFailed')}</span>
          </>
        ) : (
          <>
            <Clipboard className="w-3 h-3" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  };

  return {
    copyStates,
    copyToClipboard,
    renderCopyButton,
  };
};
