"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Folder, Check, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Renderer } from "../../shared/RendererHeader";
import { cn } from "../../utils/cn";
import { COLORS } from "../../constants/colors";

type Props = {
  result: string;
  title?: string;
};

export const StringRenderer = ({ result, title }: Props) => {
  const { t } = useTranslation();
  // 파일 트리나 디렉토리 구조인지 확인
  const isFileTree =
    result.includes("/") &&
    (result.includes("- ") || result.includes("├") || result.includes("└"));

  const getTitle = () => {
    if (title) {
      return t(title);
    }
    if (isFileTree) {
      return t("file.structure");
    }
    return t("toolResult.title");
  };

  // 접기/펼치기 상태 관리
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LINES = 15; // 최대 표시 줄 수
  const resultLines = result.split("\n");
  const shouldCollapse = resultLines.length > MAX_LINES;
  const displayResult =
    shouldCollapse && !isExpanded
      ? resultLines.slice(0, MAX_LINES).join("\n")
      : result;

  return (
    <Renderer className={cn(COLORS.tools.file.bg, COLORS.tools.file.border)}>
      <Renderer.Header
        title={getTitle()}
        icon={
          isFileTree ? (
            <Folder className={cn(COLORS.tools.file.icon)} />
          ) : (
            <Check className={cn(COLORS.tools.file.icon)} />
          )
        }
        titleClassName={COLORS.tools.file.text}
        rightContent={
          shouldCollapse && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                COLORS.ui.background.secondary,
                COLORS.ui.text.primary
              )}
            >
              {isExpanded ? (
                <>
                  <span>{t("common.collapse")}</span>
                </>
              ) : (
                <>
                  <span>{t("common.expand")} ({resultLines.length}{t("hardcoded.lines")})</span>
                </>
              )}
            </button>
          )
        }
      />
      <Renderer.Content>
        <div
          className={cn(COLORS.ui.background.primary, COLORS.ui.border.medium)}
        >
          {isFileTree ? (
            <div className={cn(COLORS.ui.text.primary)}>{displayResult}</div>
          ) : (
            <div className="p-3 prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:text-red-600 prose-code:bg-gray-100 prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayResult}
              </ReactMarkdown>
            </div>
          )}
          {shouldCollapse && !isExpanded && (
            <div
              className={cn(
                COLORS.ui.background.primary,
                COLORS.ui.border.medium
              )}
            >
              <button
                onClick={() => setIsExpanded(true)}
                className={cn(
                  "text-xs",
                  COLORS.ui.text.primary,
                  COLORS.ui.interactive.hover
                )}
              >
                <FileText className="w-3 h-3 inline mr-1" />
                {t("file.viewMoreLines", { count: resultLines.length - MAX_LINES })}
              </button>
            </div>
          )}
        </div>
      </Renderer.Content>
    </Renderer>
  );
};
