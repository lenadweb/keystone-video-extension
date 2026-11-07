import { useEffect, useState } from 'react';
import { INITIAL_STATUS, PAGE_RETRY_MS } from 'src/popup/constants/page';
import { PageStatusKind } from 'src/popup/enums/pageStatus';
import { countVideosInTab } from 'src/popup/services/page';
import { injectContentScript } from 'src/popup/services/scripting';
import type { PageStatus } from 'src/popup/types/page';
import { getActiveTab } from 'src/shared/services/tabs';

export const usePageStatus = (): PageStatus => {
    const [status, setStatus] = useState<PageStatus>(INITIAL_STATUS);

    useEffect(() => {
        let disposed = false;
        let revision = 0;
        let retryTimer: number | undefined;

        const check = async () => {
            const request = ++revision;

            try {
                const tab = await getActiveTab();
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
        retryTimer = window.setTimeout(run, PAGE_RETRY_MS);

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
