import { FORCE_REAPPLY_DELAYS } from 'src/content/constants/playback';
import type { VideoUpdates } from 'src/content/types/controllers';
import type { VideoVisitor } from 'src/content/types/runtime';

export const createVideoUpdates = (
    videos: Set<HTMLVideoElement>,
    apply: VideoVisitor
): VideoUpdates => {
    const pending = new Set<HTMLVideoElement>();
    let destroyed = false;
    let flushTimer: number | null = null;
    let forceTimers: number[] = [];
    const flush = (): void => {
        flushTimer = null;
        if (destroyed) return;
        pending.forEach(apply);
        pending.clear();
    };
    const scheduleFlush = (): void => {
        if (flushTimer === null) flushTimer = window.setTimeout(flush, 0);
    };
    const scheduleVideo = (video: HTMLVideoElement): void => {
        if (destroyed) return;
        pending.add(video);
        scheduleFlush();
    };
    const scheduleAll = (): void => {
        if (destroyed) return;
        videos.forEach((video) => pending.add(video));
        scheduleFlush();
    };
    const clearForceTimers = (): void => {
        forceTimers.forEach((timer) => window.clearTimeout(timer));
        forceTimers = [];
    };
    const reapply = (): void => {
        if (destroyed) return;
        clearForceTimers();
        scheduleAll();
        forceTimers = FORCE_REAPPLY_DELAYS.map((delay) =>
            window.setTimeout(scheduleAll, delay)
        );
    };
    const destroy = (): void => {
        destroyed = true;
        if (flushTimer !== null) window.clearTimeout(flushTimer);
        flushTimer = null;
        clearForceTimers();
        pending.clear();
    };
    return { scheduleVideo, scheduleAll, reapply, destroy };
};
