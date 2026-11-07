import {
    IMPORTANT_PRIORITY,
    STYLE_PROPERTIES,
} from 'src/content/constants/videoStyles';
import type { StyleProperty } from 'src/content/enums/styleProperty';
import type { StyleBackup, StyleValues } from 'src/content/types/videoStyles';

export const readInlineStyles = (style: CSSStyleDeclaration): StyleValues => {
    const values = {} as StyleValues;
    for (const property of STYLE_PROPERTIES)
        values[property] = {
            value: style.getPropertyValue(property),
            priority: style.getPropertyPriority(property),
        };
    return values;
};

export const setImportantStyle = (
    style: CSSStyleDeclaration,
    property: StyleProperty,
    value: string
): void => {
    if (
        style.getPropertyPriority(property) === IMPORTANT_PRIORITY &&
        style.getPropertyValue(property) === value
    )
        return;
    style.setProperty(property, value, IMPORTANT_PRIORITY);
};

export const restoreInlineStyles = (
    style: CSSStyleDeclaration,
    backup: StyleBackup
): void => {
    for (const property of STYLE_PROPERTIES) {
        if (
            !backup.applied[property] ||
            style.getPropertyValue(property) !== backup.applied[property]
        )
            continue;
        const { value, priority } = backup.original[property];
        if (value) style.setProperty(property, value, priority);
        else style.removeProperty(property);
    }
};
