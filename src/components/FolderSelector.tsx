import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Folder, AlertCircle } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { cn } from "../utils/cn";
import { COLORS } from "../constants/colors";

interface FolderSelectorProps {
  onFolderSelected: (path: string) => void;
  mode?: "notFound" | "change";
  onClose?: () => void;
}

export function FolderSelector({
  onFolderSelected,
  mode = "notFound",
  onClose,
}: FolderSelectorProps) {
  const { t } = useTranslation(['ui']);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const isChangeMode = mode === "change";

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: t('ui:folderSelector.selectClaudeFolder'),
      });

      if (selected && typeof selected === "string") {
        setSelectedPath(selected);
        setValidationError("");
        await validateAndSelectFolder(selected);
      }
    } catch (err) {
      console.error(t('ui:folderSelector.folderSelectError'), err);
      setValidationError(t('ui:folderSelector.folderSelectErrorMessage'));
    }
  };

  const validateAndSelectFolder = async (path: string) => {
    setIsValidating(true);
    setValidationError("");

    try {
      // Check if the selected folder is a .claude folder or contains a .claude folder
      const isValid = await invoke<boolean>("validate_claude_folder", { path });

      if (isValid) {
        onFolderSelected(path);
      } else {
        setValidationError(t('ui:folderSelector.validateError'));
      }
    } catch {
      setValidationError(t('ui:folderSelector.validationFailed'));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      className={cn(
        "h-screen flex items-center justify-center",
        COLORS.ui.background.primary
      )}
    >
      <div
        className={cn(
          "max-w-md w-full mx-auto p-8 rounded-lg shadow-lg relative",
          COLORS.ui.background.secondary,
          COLORS.ui.border.medium
        )}
      >
        {isChangeMode && onClose && (
          <button
            onClick={onClose}
            className={cn(
              "absolute left-4 top-4 flex items-center text-sm font-medium px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              COLORS.ui.text.secondary
            )}
            type="button"
          >
            <span className="mr-1">←</span>{t('ui:folderSelector.goBack')}
          </button>
        )}
        <div className="text-center">
          <div className="mb-6">
            <Folder
              className={cn("w-16 h-16 mx-auto", COLORS.ui.text.primary)}
            />
          </div>

          <h1 className={cn("text-2xl font-bold mb-2", COLORS.ui.text.primary)}>
            {isChangeMode
              ? t('ui:folderSelector.changeFolder')
              : t('ui:folderSelector.folderNotFound')}
          </h1>

          <p className={cn("mb-8", COLORS.ui.text.secondary)}>
            {isChangeMode
              ? t('ui:folderSelector.changeFolderDesc')
              : t('ui:folderSelector.folderNotFoundDesc')}
          </p>

          <button
            onClick={handleSelectFolder}
            disabled={isValidating}
            className={cn(
              "w-full px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium",
              COLORS.ui.background.primary,
              COLORS.ui.text.primary
            )}
          >
            {isValidating ? t('ui:folderSelector.validating') : t('ui:folderSelector.selectFolder')}
          </button>

          {selectedPath && (
            <div
              className={cn(
                "mt-4 p-3 rounded-lg text-sm",
                COLORS.ui.background.secondary,
                COLORS.ui.text.secondary
              )}
            >
              <p className="truncate">{t('ui:folderSelector.selectedPath', { path: selectedPath })}</p>
            </div>
          )}

          {validationError && (
            <div
              className={cn(
                "mt-4 p-3 rounded-lg",
                COLORS.ui.background.error,
                COLORS.ui.border.error
              )}
            >
              <div className="flex items-start space-x-2">
                <AlertCircle
                  className={cn(
                    "w-5 h-5 flex-shrink-0 mt-0.5",
                    COLORS.ui.text.error
                  )}
                />
                <p className={cn("text-sm", COLORS.ui.text.error)}>
                  {validationError}
                </p>
              </div>
            </div>
          )}

          <div
            className={cn(
              "mt-8 p-4 rounded-lg",
              COLORS.ui.background.primary,
              COLORS.ui.border.medium
            )}
          >
            <h3 className={cn("font-semibold mb-2", COLORS.ui.text.primary)}>
              {t('ui:folderSelector.help')}
            </h3>
            <ul
              className={cn(
                "text-sm space-y-1 text-left",
                COLORS.ui.text.secondary
              )}
            >
              {t('ui:folderSelector.helpItems', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
