import type { I18nKey } from 'src/shared/types/i18n';

export const t = (key: I18nKey, substitutions?: string[]): string =>
    chrome.i18n.getMessage(key, substitutions) || key;
