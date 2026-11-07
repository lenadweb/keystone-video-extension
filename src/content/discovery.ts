export const observeVideos = (
    registerVideo: (video: HTMLVideoElement) => void,
    unregisterVideo: (video: HTMLVideoElement) => void
): (() => void) => {
    const observedRoots = new WeakSet<ParentNode>();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(scanNode);
            mutation.removedNodes.forEach(unregisterNode);
        });
    });

    const observeRoot = (root: ParentNode): void => {
        if (observedRoots.has(root)) return;
        observedRoots.add(root);
        observer.observe(root, { childList: true, subtree: true });
    };

    const visitVideos = (
        root: ParentNode,
        visit: (video: HTMLVideoElement) => void
    ): void => {
        root.querySelectorAll('video').forEach((video) => {
            if (video instanceof HTMLVideoElement) visit(video);
        });
        root.querySelectorAll('*').forEach((element) => {
            if (!element.shadowRoot) return;
            observeRoot(element.shadowRoot);
            visitVideos(element.shadowRoot, visit);
        });
    };

    const scanNode = (node: Node): void => {
        if (node instanceof HTMLVideoElement) {
            registerVideo(node);
            return;
        }
        if (!(node instanceof Element)) return;
        if (node.shadowRoot) {
            observeRoot(node.shadowRoot);
            visitVideos(node.shadowRoot, registerVideo);
        }
        visitVideos(node, registerVideo);
    };

    const unregisterNode = (node: Node): void => {
        if (node instanceof HTMLVideoElement) {
            unregisterVideo(node);
            return;
        }
        if (!(node instanceof Element)) return;
        if (node.shadowRoot) visitVideos(node.shadowRoot, unregisterVideo);
        visitVideos(node, unregisterVideo);
    };

    if (document.documentElement) observeRoot(document.documentElement);
    visitVideos(document, registerVideo);
    return () => observer.disconnect();
};
