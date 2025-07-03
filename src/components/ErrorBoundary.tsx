import { Component, type ErrorInfo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Mail, Copy, RefreshCw } from "lucide-react";
import { COLORS } from "../constants/colors";
import { cn } from "../utils/cn";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

interface ErrorDisplayProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  onCopyError: () => void;
  onReset: () => void;
}

const ErrorDisplay = ({ error, errorInfo, copied, onCopyError, onReset }: ErrorDisplayProps) => {
  const { t } = useTranslation(['errors']);

  const copyErrorDetails = () => {
    const errorDetails = `
${t('errors:errorBoundary.errorInfo')}:
---------
${t('errors:errorBoundary.errorMessage')}: ${error?.message || t('errors:errorBoundary.unknownError')}
${t('errors:errorBoundary.errorStack')}: ${error?.stack || t('errors:errorBoundary.noStackTrace')}

${t('errors:errorBoundary.componentStack')}:
${errorInfo?.componentStack || t('errors:errorBoundary.noComponentStack')}

${t('errors:errorBoundary.browserInfo')}:
${navigator.userAgent}

${t('errors:errorBoundary.occurredAt')}: ${new Date().toISOString()}
    `;

    navigator.clipboard.writeText(errorDetails);
    onCopyError();
  };

  const emailSubject = encodeURIComponent(
    `${t('errors:errorBoundary.emailSubject')}: ${
      error?.message || t('errors:errorBoundary.unknownError')
    }`
  );
  const emailBody = encodeURIComponent(t('errors:errorBoundary.emailBody'));

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        COLORS.ui.background.primary
      )}
    >
      <div
        className={cn(
          "max-w-2xl w-full p-8 rounded-lg shadow-lg",
          COLORS.ui.background.white,
          COLORS.ui.border.light,
          "border"
        )}
      >
        <div className="text-center mb-6">
          <AlertTriangle
            className={cn(
              "w-16 h-16 mx-auto mb-4",
              COLORS.semantic.error.icon
            )}
          />
          <h1
            className={cn(
              "text-2xl font-bold mb-2",
              COLORS.semantic.error.textDark
            )}
          >
            {t('errors:errorBoundary.title')}
          </h1>
          <p className={cn("text-lg", COLORS.ui.text.secondary)}>
            {t('errors:errorBoundary.subtitle')}
          </p>
        </div>

        <div
          className={cn(
            "mb-6 p-4 rounded-lg",
            COLORS.semantic.error.bg,
            COLORS.semantic.error.border,
            "border"
          )}
        >
          <h2
            className={cn(
              "font-semibold mb-2",
              COLORS.semantic.error.textDark
            )}
          >
            {t('errors:errorBoundary.errorInfo')}
          </h2>
          <pre
            className={cn(
              "text-sm overflow-x-auto whitespace-pre-wrap",
              COLORS.ui.text.tertiary
            )}
          >
            {error?.message || t('errors:errorBoundary.unknownError')}
          </pre>
          {error?.stack && (
            <details className="mt-2">
              <summary
                className={cn(
                  "cursor-pointer text-sm",
                  COLORS.ui.text.muted
                )}
              >
                {t('errors:errorBoundary.showDetails')}
              </summary>
              <pre
                className={cn(
                  "mt-2 text-xs overflow-x-auto whitespace-pre-wrap",
                  COLORS.ui.text.muted
                )}
              >
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <div
            className={cn(
              "p-4 rounded-lg",
              COLORS.semantic.info.bg,
              COLORS.semantic.info.border,
              "border"
            )}
          >
            <h3
              className={cn(
                "font-semibold mb-2 flex items-center",
                COLORS.semantic.info.textDark
              )}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t('errors:errorBoundary.reportError')}
            </h3>
            <p className={cn("text-sm mb-3", COLORS.ui.text.secondary)}>
              {t('errors:errorBoundary.reportDescription')}
            </p>
            <div className="flex flex-col space-y-2">
              <a
                href={`mailto:relee6203@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                className={cn(
                  "inline-flex items-center text-sm font-medium",
                  COLORS.semantic.info.text,
                  "hover:underline"
                )}
              >
                relee6203@gmail.com
              </a>
              <button
                onClick={copyErrorDetails}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  COLORS.semantic.info.bgDark,
                  COLORS.semantic.info.text,
                  "hover:opacity-80"
                )}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? t('errors:errorBoundary.copied') : t('errors:errorBoundary.copyErrorInfo')}
              </button>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onReset}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-colors flex items-center",
                "bg-blue-600 dark:bg-blue-500 text-white",
                "hover:bg-blue-700 dark:hover:bg-blue-600"
              )}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('errors:errorBoundary.restartApp')}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "mt-6 p-4 rounded-lg text-sm",
            COLORS.ui.background.secondary
          )}
        >
          <h4 className={cn("font-semibold mb-2", COLORS.ui.text.primary)}>
            {t('errors:errorBoundary.troubleshooting')}
          </h4>
          <ul className={cn("space-y-1", COLORS.ui.text.secondary)}>
            {t('errors:errorBoundary.troubleshootingSteps', { returnObjects: true }).map((step: string, index: number) => (
              <li key={index}>• {step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
    window.location.reload();
  };

  copyErrorDetails = () => {
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          copied={this.state.copied}
          onCopyError={this.copyErrorDetails}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
