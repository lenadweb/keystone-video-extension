import { StyleProperty } from 'src/content/enums/styleProperty';

export const STYLE_PROPERTIES = Object.values(StyleProperty);

export const CORRECTED_STYLES = {
    [StyleProperty.TransformOrigin]: '0 0',
    [StyleProperty.WillChange]: 'transform',
};

export const IMPORTANT_PRIORITY = 'important';
