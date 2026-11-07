import { OSD_MESSAGE, type OsdMessage } from 'src/shared/commands';
import { hideOsd, showOsd } from 'src/content/osd';
import { correctionSummary } from 'src/content/summary';
import {
    DEFAULT_SETTINGS,
    loadSettings,
    onSettingsChange,
    type KeystoneSettings,
} from 'src/shared/settings';

import { createVideoStyles } from 'src/content/videoStyles';
import { observeVideos } from 'src/content/discovery';

const FORCE_REAPPLY_DELAYS = [16, 60, 150, 300, 600, 1000, 1600];

export const startContent = (): (() => void) => {
    let settings: KeystoneSettings = { ...DEFAULT_SETTINGS };
    let settingsRevision = 0;
    let destroyed = false;
    let flushTimer: number | null = null;

    const activeVideos = new Set<HTMLVideoElement>();
    const pendingVideos = new Set<HTMLVideoElement>();
    const styles = createVideoStyles();

    const flush = (): void => {
        flushTimer = null;
        if (destroyed) return;

        pendingVideos.forEach((video) => styles.apply(video, settings));
        pendingVideos.clear();
    };

    const scheduleApply = (video: HTMLVideoElement): void => {
        if (destroyed) return;
        pendingVideos.add(video);
        if (flushTimer === null) {
            flushTimer = window.setTimeout(flush, 0);
        }
    };

    const scheduleAll = (): void => {
        if (destroyed) return;
        activeVideos.forEach((video) => pendingVideos.add(video));
        if (flushTimer === null) {
            flushTimer = window.setTimeout(flush, 0);
        }
    };

    const resizeObserver = new ResizeObserver((entries) => {
        if (destroyed) return;
        entries.forEach(({ target }) => {
            if (
                target instanceof HTMLVideoElement &&
                activeVideos.has(target)
            ) {
                scheduleApply(target);
            }
        });
    });

    const styleObserver = new MutationObserver((mutations) => {
        if (destroyed) return;
        mutations.forEach(({ target }) => {
            if (
                target instanceof HTMLVideoElement &&
                activeVideos.has(target)
            ) {
                scheduleApply(target);
            }
        });
    });

    let forceTimers: number[] = [];

    const clearForceTimers = (): void => {
        forceTimers.forEach((timer) => window.clearTimeout(timer));
        forceTimers = [];
    };

    const forceReapply = (): void => {
        if (destroyed) return;
        clearForceTimers();
        scheduleAll();
        forceTimers = FORCE_REAPPLY_DELAYS.map((delay) =>
            window.setTimeout(scheduleAll, delay)
        );
    };

    const registerVideo = (video: HTMLVideoElement): void => {
        if (destroyed || activeVideos.has(video)) return;
        activeVideos.add(video);
        resizeObserver.observe(video);
        styleObserver.observe(video, {
            attributes: true,
            attributeFilter: ['style'],
        });
        scheduleApply(video);
    };

    const unregisterVideo = (video: HTMLVideoElement): void => {
        if (video.isConnected && activeVideos.has(video)) {
            scheduleApply(video);
            return;
        }
        if (!activeVideos.delete(video)) return;
        resizeObserver.unobserve(video);
        styles.restore(video);
    };

    const stopDiscovery = observeVideos(registerVideo, unregisterVideo);

    const hasVisibleVideo = (): boolean => {
        for (const video of activeVideos) {
            if (
                video.isConnected &&
                video.offsetWidth > 0 &&
                video.offsetHeight > 0
            ) {
                return true;
            }
        }
        return false;
    };

    const handleMessage = (message: unknown): void => {
        const osd = message as OsdMessage | null;
        if (osd?.type !== OSD_MESSAGE || !hasVisibleVideo()) return;
        showOsd(correctionSummary(osd.settings), osd.settings.enabled);
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    const applyLoadedSettings = (next: KeystoneSettings): void => {
        settings = next;
        settingsRevision += 1;
        scheduleAll();
    };

    const unsubscribe = onSettingsChange((next) => {
        if (!destroyed) applyLoadedSettings(next);
    });

    const load = async (): Promise<void> => {
        const request = settingsRevision;
        try {
            const loaded = await loadSettings();
            if (destroyed || request !== settingsRevision) return;
            applyLoadedSettings(loaded);
        } catch (error) {
            console.error('Keystone: unable to load settings', error);
        }
    };

    const handleFullscreen = (): void => {
        hideOsd();
        forceReapply();
    };

    const handleResize = (): void => {
        scheduleAll();
    };

    const handlePageShow = (event: PageTransitionEvent): void => {
        if (!event.persisted) return;
        load().catch(console.error);
        forceReapply();
    };

    const handleVisibility = (): void => {
        if (document.visibilityState === 'visible') forceReapply();
    };

    document.addEventListener('fullscreenchange', handleFullscreen);
    document.addEventListener('webkitfullscreenchange', handleFullscreen);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize);
    window.addEventListener('pageshow', handlePageShow);

    load();

    return () => {
        destroyed = true;
        if (flushTimer !== null) window.clearTimeout(flushTimer);
        flushTimer = null;
        clearForceTimers();
        stopDiscovery();
        styleObserver.disconnect();
        resizeObserver.disconnect();
        chrome.runtime.onMessage.removeListener(handleMessage);
        unsubscribe();
        document.removeEventListener('fullscreenchange', handleFullscreen);
        document.removeEventListener(
            'webkitfullscreenchange',
            handleFullscreen
        );
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pageshow', handlePageShow);
        activeVideos.forEach(styles.restore);
        activeVideos.clear();
        pendingVideos.clear();
        hideOsd();
    };
};
