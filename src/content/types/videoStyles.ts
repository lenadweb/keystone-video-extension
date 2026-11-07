import type { StyleProperty } from 'src/content/enums/styleProperty';
import type { KeystoneSettings } from 'src/shared/types/settings';

export type StyleValue = { value: string; priority: string };

export type StyleValues = Record<StyleProperty, StyleValue>;

export type AppliedStyles = Record<StyleProperty, string>;

export type StyleBackup = { original: StyleValues; applied: AppliedStyles };

export type VideoStylesController = {
    apply: (video: HTMLVideoElement, settings: KeystoneSettings) => void;
    restore: (video: HTMLVideoElement) => void;
};
