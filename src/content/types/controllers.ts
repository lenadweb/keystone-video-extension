import type { VideoVisitor } from 'src/content/types/runtime';
import type { Dispose } from 'src/shared/types/lifecycle';

export type VideoUpdates = {
    scheduleVideo: VideoVisitor;
    scheduleAll: Dispose;
    reapply: Dispose;
    destroy: Dispose;
};

export type VideoObservers = {
    observe: VideoVisitor;
    unobserve: VideoVisitor;
    disconnect: Dispose;
};

export type VideoCorrection = {
    refresh: Dispose;
    reapply: Dispose;
    hasVisibleVideo: () => boolean;
    destroy: Dispose;
};

export type PageLifecycleHandlers = {
    onFullscreen: Dispose;
    onResize: Dispose;
    onRestore: Dispose;
    onVisible: Dispose;
};

export type OsdElements = {
    host: HTMLDivElement;
    pill: HTMLDivElement;
    dot: HTMLSpanElement;
    text: HTMLSpanElement;
};

export type OsdController = {
    show: (message: string, enabled?: boolean) => void;
    hide: Dispose;
};
