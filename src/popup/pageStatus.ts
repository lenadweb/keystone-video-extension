export enum PageStatusKind {
    Loading = 'loading',
    Ready = 'ready',
    NoVideos = 'no_videos',
    Unavailable = 'unavailable',
}

export type PageStatus = {
    kind: PageStatusKind;
    videoCount: number;
};

const countVideosInFrame = (): number => {
    const countRoot = (root: ParentNode): number => {
        let total = 0;

        root.querySelectorAll('video').forEach((video) => {
            if (
                video.isConnected &&
                video.offsetWidth > 0 &&
                video.offsetHeight > 0
            ) {
                total += 1;
            }
        });

        root.querySelectorAll('*').forEach((element) => {
            if (element.shadowRoot) total += countRoot(element.shadowRoot);
        });

        return total;
    };

    return countRoot(document);
};

export const injectContentScript = async (tabId: number): Promise<void> => {
    try {
        await chrome.scripting.executeScript({
            target: { tabId, allFrames: true },
            files: ['content.js'],
        });
    } catch {
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
        });
    }
};

export const countVideosInTab = async (tabId: number): Promise<number> => {
    const targets: chrome.scripting.InjectionTarget[] = [
        { tabId, allFrames: true },
        { tabId },
    ];
    let lastError: unknown;

    for (const target of targets) {
        try {
            const results = await chrome.scripting.executeScript({
                target,
                func: countVideosInFrame,
            });
            return results.reduce(
                (total, frame) =>
                    total +
                    (typeof frame.result === 'number' ? frame.result : 0),
                0
            );
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError ?? new Error('Unable to inspect the active tab');
};
