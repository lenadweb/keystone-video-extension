import { countVideosInFrame } from 'src/popup/injected/countVideos';
import { executeInTabFrames } from 'src/popup/services/scripting';

export const countVideosInTab = async (tabId: number): Promise<number> => {
    const results = await executeInTabFrames(tabId, (target) =>
        chrome.scripting.executeScript({ target, func: countVideosInFrame })
    );
    return results.reduce(
        (total, frame) =>
            total + (typeof frame.result === 'number' ? frame.result : 0),
        0
    );
};
