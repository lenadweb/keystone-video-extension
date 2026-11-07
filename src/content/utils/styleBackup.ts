import { STYLE_PROPERTIES } from 'src/content/constants/videoStyles';
import { StyleProperty } from 'src/content/enums/styleProperty';
import type {
    AppliedStyles,
    StyleBackup,
    StyleValues,
} from 'src/content/types/videoStyles';

export const createStyleBackup = (original: StyleValues): StyleBackup => ({
    original,
    applied: {
        [StyleProperty.Transform]: '',
        [StyleProperty.TransformOrigin]: '',
        [StyleProperty.WillChange]: '',
    },
});

export const adoptSiteStyles = (
    backup: StyleBackup,
    current: StyleValues
): StyleBackup => {
    const original = { ...backup.original };
    for (const property of STYLE_PROPERTIES) {
        if (current[property].value !== backup.applied[property])
            original[property] = { ...current[property] };
    }
    return { original, applied: { ...backup.applied } };
};

export const recordAppliedStyles = (
    backup: StyleBackup,
    current: StyleValues
): StyleBackup => {
    const applied = {} as AppliedStyles;
    for (const property of STYLE_PROPERTIES)
        applied[property] = current[property].value;
    return { original: backup.original, applied };
};
