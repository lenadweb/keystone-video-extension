import { useEffect, useState } from 'react';
import {
    countVideosInTab,
    injectContentScript,
    PageStatus,
    PageStatusKind,
} from 'src/popup/pageStatus';

const INITIAL_STATUS: PageStatus = {
    kind: PageStatusKind.Loading,
    videoCount: 0,
};

export const usePageStatus = (): PageStatus => {
    const [status, setStatus] = useState<PageStatus>(INITIAL_STATUS);

    useEffect(() => {
        let disposed = false;
        let revision = 0;
        let retryTimer: number | undefined;

        const check = async () => {
            const request = ++revision;

            try {
                const [tab] = await chrome.tabs.query({
                    active: true,
                    currentWindow: true,
                });
                if (!tab?.id) throw new Error('No active tab');

                await injectContentScript(tab.id);
                const videoCount = await countVideosInTab(tab.id);

                if (!disposed && request === revision) {
                    setStatus({
                        kind:
                            videoCount > 0
                                ? PageStatusKind.Ready
                                : PageStatusKind.NoVideos,
                        videoCount,
                    });
                }
            } catch {
                if (!disposed && request === revision) {
                    setStatus({
                        kind: PageStatusKind.Unavailable,
                        videoCount: 0,
                    });
                }
            }
        };

        const run = () => {
            check().catch(console.error);
        };

        run();
        retryTimer = window.setTimeout(run, 700);

        const handleFocus = () => run();
        window.addEventListener('focus', handleFocus);

        return () => {
            disposed = true;
            if (retryTimer !== undefined) window.clearTimeout(retryTimer);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    return status;
};
