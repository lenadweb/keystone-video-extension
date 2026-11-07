import { useEffect, useState } from 'react';
import { captureVideoSnapshot, VideoSnapshot } from 'src/popup/snapshot';

const REFRESH_MS = 10_000;

const MAX_WIDTH = 440;

const FIRST_FRAME_RETRIES = [400, 1200, 2500];

export const useVideoSnapshot = (hasVideo: boolean): VideoSnapshot | null => {
    const [snapshot, setSnapshot] = useState<VideoSnapshot | null>(null);

    useEffect(() => {
        if (!hasVideo) return undefined;

        let disposed = false;
        let isBusy = false;
        let hasFrame = false;
        let retryTimers: number[] = [];

        const capture = async () => {
            if (isBusy || document.visibilityState !== 'visible') return;
            isBusy = true;
            try {
                const [tab] = await chrome.tabs.query({
                    active: true,
                    currentWindow: true,
                });
                if (!tab?.id) return;
                const next = await captureVideoSnapshot(tab.id, MAX_WIDTH);

                if (!disposed && next) {
                    hasFrame = true;
                    setSnapshot(next);
                }
            } finally {
                isBusy = false;
            }
        };

        const run = () => {
            capture().catch(console.error);
        };

        run();
        retryTimers = FIRST_FRAME_RETRIES.map((delay) =>
            window.setTimeout(() => {
                if (!hasFrame) run();
            }, delay)
        );
        const timer = window.setInterval(run, REFRESH_MS);
        window.addEventListener('focus', run);

        return () => {
            disposed = true;
            window.clearInterval(timer);
            retryTimers.forEach((retry) => window.clearTimeout(retry));
            window.removeEventListener('focus', run);
        };
    }, [hasVideo]);

    return snapshot;
};
