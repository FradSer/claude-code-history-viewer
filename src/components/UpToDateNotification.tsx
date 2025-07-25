import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, X } from "lucide-react";
import { cn } from "../utils/cn";
import { COLORS } from "../constants/colors";
import type { UpdateInfo } from "../types";

interface UpToDateNotificationProps {
  updateInfo: UpdateInfo;
  onClose: () => void;
  isVisible: boolean;
}

export function UpToDateNotification({
  updateInfo,
  onClose,
  isVisible,
}: UpToDateNotificationProps) {
  const { t } = useTranslation(['ui']);
  
  // Auto-hide after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 min-w-80 max-w-sm",
          COLORS.ui.border.light
        )}
      >
        <div className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-full", COLORS.semantic.success.bg)}>
            <CheckCircle
              className={cn("w-5 h-5", COLORS.semantic.success.icon)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn("text-sm font-semibold", COLORS.ui.text.primary)}>
              {t('ui:upToDate.title')}
            </h3>
            <p className={cn("text-xs mt-1", COLORS.ui.text.secondary)}>
              {t('ui:upToDate.message', { version: updateInfo.current_version })}
            </p>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              COLORS.ui.text.muted
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
