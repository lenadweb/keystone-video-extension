import type messages from 'public/_locales/en/messages.json';

export type I18nKey = keyof typeof messages;

export const t = (key: I18nKey, substitutions?: string[]): string =>
    chrome.i18n.getMessage(key, substitutions) || key;
