import type messages from 'public/_locales/en/messages.json';

export type I18nKey = keyof typeof messages;

export type Translate = (key: I18nKey, substitutions?: string[]) => string;
