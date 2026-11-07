import type { VideoVisitor } from 'src/content/types/runtime';

export const isVisibleVideo = (video: HTMLVideoElement): boolean =>
    video.isConnected && video.offsetWidth > 0 && video.offsetHeight > 0;

export const visitVideoRoots = (
    root: ParentNode,
    onVideo: VideoVisitor,
    onRoot: (root: ParentNode) => void
): void => {
    for (const video of root.querySelectorAll('video')) {
        if (video instanceof HTMLVideoElement) onVideo(video);
    }
    for (const element of root.querySelectorAll('*')) {
        if (!element.shadowRoot) continue;
        onRoot(element.shadowRoot);
        visitVideoRoots(element.shadowRoot, onVideo, onRoot);
    }
};

export const visitNodeVideos = (
    node: Node,
    onVideo: VideoVisitor,
    onRoot: (root: ParentNode) => void
): void => {
    if (node instanceof HTMLVideoElement) {
        onVideo(node);
        return;
    }
    if (!(node instanceof Element)) return;
    if (node.shadowRoot) {
        onRoot(node.shadowRoot);
        visitVideoRoots(node.shadowRoot, onVideo, onRoot);
    }
    visitVideoRoots(node, onVideo, onRoot);
};
