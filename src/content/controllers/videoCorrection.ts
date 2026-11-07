import { observeVideos } from 'src/content/controllers/discovery';
import { createVideoObservers } from 'src/content/controllers/videoObservers';
import { createVideoStyles } from 'src/content/controllers/videoStyles';
import { createVideoUpdates } from 'src/content/controllers/videoUpdates';
import { isVisibleVideo } from 'src/content/dom/videos';
import type { VideoCorrection } from 'src/content/types/controllers';
import type { KeystoneSettings } from 'src/shared/types/settings';

export const createVideoCorrection = (
    getSettings: () => KeystoneSettings
): VideoCorrection => {
    const videos = new Set<HTMLVideoElement>();
    const styles = createVideoStyles();
    const updates = createVideoUpdates(videos, (video) =>
        styles.apply(video, getSettings())
    );
    const observers = createVideoObservers((video) => {
        if (videos.has(video)) updates.scheduleVideo(video);
    });
    const register = (video: HTMLVideoElement): void => {
        if (videos.has(video)) return;
        videos.add(video);
        observers.observe(video);
        updates.scheduleVideo(video);
    };
    const unregister = (video: HTMLVideoElement): void => {
        if (video.isConnected && videos.has(video)) {
            updates.scheduleVideo(video);
            return;
        }
        if (!videos.delete(video)) return;
        observers.unobserve(video);
        styles.restore(video);
    };
    const stopDiscovery = observeVideos(register, unregister);
    const hasVisibleVideo = (): boolean => {
        for (const video of videos) if (isVisibleVideo(video)) return true;
        return false;
    };
    const destroy = (): void => {
        stopDiscovery();
        observers.disconnect();
        updates.destroy();
        videos.forEach(styles.restore);
        videos.clear();
    };
    return {
        refresh: updates.scheduleAll,
        reapply: updates.reapply,
        hasVisibleVideo,
        destroy,
    };
};
