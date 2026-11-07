import type { VideoObservers } from 'src/content/types/controllers';
import type { VideoVisitor } from 'src/content/types/runtime';

export const createVideoObservers = (
    onChange: VideoVisitor
): VideoObservers => {
    const resize = new ResizeObserver((entries) => {
        for (const { target } of entries)
            if (target instanceof HTMLVideoElement) onChange(target);
    });
    const style = new MutationObserver((mutations) => {
        for (const { target } of mutations)
            if (target instanceof HTMLVideoElement) onChange(target);
    });
    const observe = (video: HTMLVideoElement): void => {
        resize.observe(video);
        style.observe(video, { attributes: true, attributeFilter: ['style'] });
    };
    const unobserve = (video: HTMLVideoElement): void => {
        resize.unobserve(video);
    };
    const disconnect = (): void => {
        resize.disconnect();
        style.disconnect();
    };
    return { observe, unobserve, disconnect };
};
