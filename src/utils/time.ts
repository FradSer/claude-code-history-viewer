import i18n from '../i18n';

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const locale = getLocaleForLanguage(i18n.language);
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getLocaleForLanguage = (language: string): string => {
  switch (language) {
    case 'ko': return 'ko-KR';
    case 'zh': return 'zh-CN';
    case 'en':
    default: return 'en-US';
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 1) {
    return i18n.t('ui:time.lessThanMinute');
  }
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = Math.floor(minutes % 60);

  const parts: string[] = [];
  if (days > 0) {
    parts.push(i18n.t('ui:time.days', { count: days }));
  }
  if (hours > 0) {
    parts.push(i18n.t('ui:time.hours', { count: hours }));
  }
  if (mins > 0) {
    parts.push(i18n.t('ui:time.minutes', { count: mins }));
  }

  return parts.join(" ");
};