import type { FrameSnapshot, VideoSnapshot } from 'src/popup/types/snapshot';

export const selectLargestSnapshot = (
    snapshots: (FrameSnapshot | null | undefined)[]
): VideoSnapshot | null => {
    let best: FrameSnapshot | null = null;
    for (const snapshot of snapshots) {
        if (snapshot && (!best || snapshot.area > best.area)) best = snapshot;
    }
    if (!best) return null;
    return { src: best.src, width: best.width, height: best.height };
};
