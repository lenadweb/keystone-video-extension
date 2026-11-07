import {
    CORRECTED_STYLES,
    STYLE_PROPERTIES,
} from 'src/content/constants/videoStyles';
import {
    readInlineStyles,
    restoreInlineStyles,
    setImportantStyle,
} from 'src/content/dom/videoStyles';
import { StyleProperty } from 'src/content/enums/styleProperty';
import type {
    StyleBackup,
    VideoStylesController,
} from 'src/content/types/videoStyles';
import {
    adoptSiteStyles,
    createStyleBackup,
    recordAppliedStyles,
} from 'src/content/utils/styleBackup';
import type { KeystoneSettings } from 'src/shared/types/settings';
import { buildMatrix3d } from 'src/shared/utils/geometry/matrix';

export const createVideoStyles = (): VideoStylesController => {
    const backups = new WeakMap<HTMLVideoElement, StyleBackup>();
    const restore = (video: HTMLVideoElement): void => {
        const backup = backups.get(video);
        if (!backup) return;
        restoreInlineStyles(video.style, backup);
        backups.delete(video);
    };
    const apply = (
        video: HTMLVideoElement,
        settings: KeystoneSettings
    ): void => {
        const matrix =
            video.isConnected && settings.enabled
                ? buildMatrix3d(
                      settings.vertical,
                      settings.horizontal,
                      video.offsetWidth,
                      video.offsetHeight
                  )
                : null;
        if (!matrix) {
            restore(video);
            return;
        }
        const current = readInlineStyles(video.style);
        const previous = backups.get(video);
        const backup = previous
            ? adoptSiteStyles(previous, current)
            : createStyleBackup(current);
        const desired = {
            ...CORRECTED_STYLES,
            [StyleProperty.Transform]: matrix,
        };
        for (const property of STYLE_PROPERTIES)
            setImportantStyle(video.style, property, desired[property]);
        backups.set(
            video,
            recordAppliedStyles(backup, readInlineStyles(video.style))
        );
    };
    return { apply, restore };
};
