import { buildMatrix3d } from 'src/shared/keystone';
import type { KeystoneSettings } from 'src/shared/settings';

type StyleBackup = {
    transform: string;
    transformPriority: string;
    transformOrigin: string;
    transformOriginPriority: string;
    willChange: string;
    willChangePriority: string;
    appliedTransform: string;
    appliedOrigin: string;
    appliedWillChange: string;
};

export const createVideoStyles = () => {
    const backups = new WeakMap<HTMLVideoElement, StyleBackup>();

    const captureStyle = (video: HTMLVideoElement): StyleBackup => ({
        transform: video.style.getPropertyValue('transform'),
        transformPriority: video.style.getPropertyPriority('transform'),
        transformOrigin: video.style.getPropertyValue('transform-origin'),
        transformOriginPriority:
            video.style.getPropertyPriority('transform-origin'),
        willChange: video.style.getPropertyValue('will-change'),
        willChangePriority: video.style.getPropertyPriority('will-change'),
        appliedTransform: '',
        appliedOrigin: '',
        appliedWillChange: '',
    });

    const restoreProperty = (
        style: CSSStyleDeclaration,
        property: string,
        value: string,
        priority: string
    ): void => {
        if (value) style.setProperty(property, value, priority);
        else style.removeProperty(property);
    };

    const restore = (video: HTMLVideoElement): void => {
        const backup = backups.get(video);
        if (!backup) return;

        if (
            backup.appliedTransform &&
            video.style.getPropertyValue('transform') ===
                backup.appliedTransform
        ) {
            restoreProperty(
                video.style,
                'transform',
                backup.transform,
                backup.transformPriority
            );
        }

        if (
            backup.appliedOrigin &&
            video.style.getPropertyValue('transform-origin') ===
                backup.appliedOrigin
        ) {
            restoreProperty(
                video.style,
                'transform-origin',
                backup.transformOrigin,
                backup.transformOriginPriority
            );
        }

        if (
            backup.appliedWillChange &&
            video.style.getPropertyValue('will-change') ===
                backup.appliedWillChange
        ) {
            restoreProperty(
                video.style,
                'will-change',
                backup.willChange,
                backup.willChangePriority
            );
        }

        backups.delete(video);
    };

    const setImportant = (
        video: HTMLVideoElement,
        property: string,
        value: string
    ): void => {
        const { style } = video;
        if (
            style.getPropertyPriority(property) === 'important' &&
            style.getPropertyValue(property) === value
        ) {
            return;
        }
        style.setProperty(property, value, 'important');
    };

    const adoptSiteStyle = (
        video: HTMLVideoElement,
        backup: StyleBackup
    ): void => {
        const { style } = video;
        const transform = style.getPropertyValue('transform');
        if (transform !== backup.appliedTransform) {
            backup.transform = transform;
            backup.transformPriority = style.getPropertyPriority('transform');
        }
        const origin = style.getPropertyValue('transform-origin');
        if (origin !== backup.appliedOrigin) {
            backup.transformOrigin = origin;
            backup.transformOriginPriority =
                style.getPropertyPriority('transform-origin');
        }
        const willChange = style.getPropertyValue('will-change');
        if (willChange !== backup.appliedWillChange) {
            backup.willChange = willChange;
            backup.willChangePriority =
                style.getPropertyPriority('will-change');
        }
    };

    const apply = (
        video: HTMLVideoElement,
        settings: KeystoneSettings
    ): void => {
        if (!video.isConnected) {
            restore(video);
            return;
        }

        const hasCorrection =
            settings.enabled &&
            (settings.vertical !== 0 || settings.horizontal !== 0);
        const width = video.offsetWidth;
        const height = video.offsetHeight;
        const matrix =
            hasCorrection && width > 0 && height > 0
                ? buildMatrix3d(
                      settings.vertical,
                      settings.horizontal,
                      width,
                      height
                  )
                : null;

        if (!matrix) {
            restore(video);
            return;
        }

        let backup = backups.get(video);
        if (!backup) {
            backup = captureStyle(video);
            backups.set(video, backup);
        } else {
            adoptSiteStyle(video, backup);
        }

        setImportant(video, 'transform-origin', '0 0');
        setImportant(video, 'transform', matrix);
        setImportant(video, 'will-change', 'transform');
        backup.appliedTransform = video.style.getPropertyValue('transform');
        backup.appliedOrigin = video.style.getPropertyValue('transform-origin');
        backup.appliedWillChange = video.style.getPropertyValue('will-change');
    };

    return { apply, restore };
};
