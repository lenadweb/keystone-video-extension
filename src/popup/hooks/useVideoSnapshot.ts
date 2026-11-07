import { useEffect, useState } from 'react';
import {
    FIRST_FRAME_RETRIES,
    SNAPSHOT_MAX_WIDTH,
    SNAPSHOT_REFRESH_MS,
} from 'src/popup/constants/preview';
import { captureVideoSnapshot } from 'src/popup/services/snapshot';
import type { VideoSnapshot } from 'src/popup/types/snapshot';
import { getActiveTab } from 'src/shared/services/tabs';

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
                const tab = await getActiveTab();
                if (!tab?.id) return;
                const next = await captureVideoSnapshot(
                    tab.id,
                    SNAPSHOT_MAX_WIDTH
                );

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
        const timer = window.setInterval(run, SNAPSHOT_REFRESH_MS);
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
