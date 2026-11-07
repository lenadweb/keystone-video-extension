import { visitNodeVideos, visitVideoRoots } from 'src/content/dom/videos';
import type { VideoVisitor } from 'src/content/types/runtime';
import type { Dispose } from 'src/shared/types/lifecycle';

export const observeVideos = (
    registerVideo: VideoVisitor,
    unregisterVideo: VideoVisitor
): Dispose => {
    const observedRoots = new WeakSet<ParentNode>();
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes)
                visitNodeVideos(node, registerVideo, observeRoot);
            for (const node of mutation.removedNodes)
                visitNodeVideos(node, unregisterVideo, observeRoot);
        }
    });
    const observeRoot = (root: ParentNode): void => {
        if (observedRoots.has(root)) return;
        observedRoots.add(root);
        observer.observe(root, { childList: true, subtree: true });
    };
    if (document.documentElement) observeRoot(document.documentElement);
    visitVideoRoots(document, registerVideo, observeRoot);
    return () => observer.disconnect();
};
