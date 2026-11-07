import { SNAPSHOT_ENCODING } from 'src/popup/constants/preview';
import { captureLargestVideo } from 'src/popup/injected/captureVideo';
import { executeInTabFrames } from 'src/popup/services/scripting';
import type { VideoSnapshot } from 'src/popup/types/snapshot';
import { selectLargestSnapshot } from 'src/popup/utils/snapshots';

export const captureVideoSnapshot = async (
    tabId: number,
    maxWidth: number
): Promise<VideoSnapshot | null> => {
    try {
        const results = await executeInTabFrames(tabId, (target) =>
            chrome.scripting.executeScript({
                target,
                func: captureLargestVideo,
                args: [{ ...SNAPSHOT_ENCODING, maxWidth }],
            })
        );
        return selectLargestSnapshot(results.map(({ result }) => result));
    } catch {
        return null;
    }
};
