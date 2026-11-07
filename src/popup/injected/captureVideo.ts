import type { FrameSnapshot, SnapshotOptions } from 'src/popup/types/snapshot';

export const captureLargestVideo = (
    options: SnapshotOptions
): FrameSnapshot | null => {
    const videos: HTMLVideoElement[] = [];
    const roots: ParentNode[] = [document];
    while (roots.length) {
        const root = roots.pop()!;
        videos.push(...root.querySelectorAll('video'));
        for (const element of root.querySelectorAll('*')) {
            if (element.shadowRoot) roots.push(element.shadowRoot);
        }
    }

    let best: HTMLVideoElement | null = null;
    let bestArea = 0;
    for (const video of videos) {
        const area = video.offsetWidth * video.offsetHeight;
        if (
            area > bestArea &&
            video.readyState >= 2 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
        ) {
            best = video;
            bestArea = area;
        }
    }

    const video = best;
    if (!video) return null;

    const scale = Math.min(1, options.maxWidth / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    try {
        context.drawImage(video, 0, 0, width, height);

        const { data } = context.getImageData(0, 0, width, height);
        let isBlank = true;
        for (
            let index = 0;
            index < data.length;
            index += options.sampleStride
        ) {
            if (
                data[index] > options.blankThreshold ||
                data[index + 1] > options.blankThreshold ||
                data[index + 2] > options.blankThreshold
            ) {
                isBlank = false;
                break;
            }
        }
        if (isBlank) return null;

        return {
            src: canvas.toDataURL(options.mimeType, options.quality),
            width: video.videoWidth,
            height: video.videoHeight,
            area: bestArea,
        };
    } catch {
        return null;
    }
};
