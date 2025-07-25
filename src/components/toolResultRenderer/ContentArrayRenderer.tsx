import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThinkingRenderer, ToolUseRenderer } from "../contentRenderer";
import { ClaudeToolResultItem } from "./ClaudeToolResultItem";

type Props = {
  toolResult: Record<string, unknown>;
};

export const ContentArrayRenderer = ({ toolResult }: Props) => {
  const { t } = useTranslation();
  const content = Array.isArray(toolResult.content) ? toolResult.content : [];
  const totalDurationMs =
    typeof toolResult.totalDurationMs === "number"
      ? toolResult.totalDurationMs
      : null;
  const totalTokens =
    typeof toolResult.totalTokens === "number" ? toolResult.totalTokens : null;
  const totalToolUseCount =
    typeof toolResult.totalToolUseCount === "number"
      ? toolResult.totalToolUseCount
      : null;
  const wasInterrupted =
    typeof toolResult.wasInterrupted === "boolean"
      ? toolResult.wasInterrupted
      : null;
  const usage =
    toolResult.usage && typeof toolResult.usage === "object"
      ? (toolResult.usage as Record<string, unknown>)
      : null;

  return (
    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Bot className="w-4 h-4" />
        <span className="font-medium text-indigo-800">{t("toolResult.claudeApiResponse")}</span>
      </div>

      {/* 메타데이터 정보 */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        {totalDurationMs && (
          <div className="bg-white p-2 rounded border">
            <div className="text-gray-600">{t("toolResult.executionTime")}</div>
            <div className="font-medium">
              {t("tokens.unit", { value: (totalDurationMs / 1000).toFixed(2) })}
            </div>
          </div>
        )}
        {totalTokens && (
          <div className="bg-white p-2 rounded border">
            <div className="text-gray-600">{t("toolResult.totalTokens")}</div>
            <div className="font-medium">{totalTokens.toLocaleString()}</div>
          </div>
        )}
        {totalToolUseCount && (
          <div className="bg-white p-2 rounded border">
            <div className="text-gray-600">{t("toolResult.toolUsageCount")}</div>
            <div className="font-medium">{totalToolUseCount}</div>
          </div>
        )}
        {wasInterrupted !== null && (
          <div className="bg-white p-2 rounded border">
            <div className="text-gray-600">{t("toolResult.interruptedStatus")}</div>
            <div
              className={`font-medium ${
                wasInterrupted ? "text-red-600" : "text-green-600"
              }`}
            >
              {wasInterrupted ? t("status.interrupted") : t("status.completed")}
            </div>
          </div>
        )}
      </div>

      {/* 사용량 정보 */}
      {usage && (
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-600 mb-1">
            {t("toolResult.tokenUsage")}
          </div>
          <div className="bg-white p-2 rounded border text-xs">
            <div className="grid grid-cols-2 gap-2">
              {typeof usage.input_tokens === "number" && (
                <div>
                  <span className="text-gray-600">{t("tokens.input")}</span>
                  <span className="font-medium ml-1">
                    {usage.input_tokens.toLocaleString()}
                  </span>
                </div>
              )}
              {typeof usage.output_tokens === "number" && (
                <div>
                  <span className="text-gray-600">{t("tokens.output")}</span>
                  <span className="font-medium ml-1">
                    {usage.output_tokens.toLocaleString()}
                  </span>
                </div>
              )}
              {typeof usage.cache_creation_input_tokens === "number" && (
                <div>
                  <span className="text-gray-600">{t("tokens.cacheCreation")}</span>
                  <span className="font-medium ml-1">
                    {usage.cache_creation_input_tokens.toLocaleString()}
                  </span>
                </div>
              )}
              {typeof usage.cache_read_input_tokens === "number" && (
                <div>
                  <span className="text-gray-600">{t("tokens.cacheRead")}</span>
                  <span className="font-medium ml-1">
                    {usage.cache_read_input_tokens.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 콘텐츠 */}
      {content.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-600 mb-1">{t("common.content")}:</div>
          <div className="space-y-2">
            {content.map((item: unknown, index: number) => {
              if (!item || typeof item !== "object") {
                return (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-500 mb-1">
                      {t("hardcoded.typeUnknown")}
                    </div>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                );
              }

              const itemObj = item as Record<string, unknown>;

              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded border max-h-80 overflow-y-auto"
                >
                  {itemObj.type === "text" &&
                    typeof itemObj.text === "string" && (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:text-red-600 prose-code:bg-gray-100 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                        {itemObj.text.includes("<thinking>") &&
                        itemObj.text.includes("</thinking>") ? (
                          <ThinkingRenderer text={itemObj.text} />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {itemObj.text}
                          </ReactMarkdown>
                        )}
                      </div>
                    )}
                  {itemObj.type === "tool_use" && (
                    <ToolUseRenderer toolUse={itemObj} />
                  )}
                  {itemObj.type === "tool_result" && (
                    <ClaudeToolResultItem toolResult={itemObj} index={index} />
                  )}
                  {!["text", "tool_use", "tool_result"].includes(
                    itemObj.type as string
                  ) && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {t("hardcoded.type")}: {String(itemObj.type || "unknown")}
                      </div>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
