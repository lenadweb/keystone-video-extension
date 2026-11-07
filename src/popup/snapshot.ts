export type VideoSnapshot = {
    src: string;
    width: number;
    height: number;
};

type FrameSnapshot = VideoSnapshot & { area: number };

const captureLargestVideo = (maxWidth: number): FrameSnapshot | null => {
    const videos: HTMLVideoElement[] = [];
    const collect = (root: ParentNode) => {
        root.querySelectorAll('video').forEach((video) => videos.push(video));
        root.querySelectorAll('*').forEach((element) => {
            if (element.shadowRoot) collect(element.shadowRoot);
        });
    };
    collect(document);

    let best: HTMLVideoElement | null = null;
    let bestArea = 0;
    videos.forEach((video) => {
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
    });

    const video = best as HTMLVideoElement | null;
    if (!video) return null;

    const scale = Math.min(1, maxWidth / video.videoWidth);
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
        for (let index = 0; index < data.length; index += 64) {
            if (
                data[index] > 12 ||
                data[index + 1] > 12 ||
                data[index + 2] > 12
            ) {
                isBlank = false;
                break;
            }
        }
        if (isBlank) return null;

        return {
            src: canvas.toDataURL('image/webp', 0.8),
            width: video.videoWidth,
            height: video.videoHeight,
            area: bestArea,
        };
    } catch {
        return null;
    }
};

export const captureVideoSnapshot = async (
    tabId: number,
    maxWidth: number
): Promise<VideoSnapshot | null> => {
    const targets: chrome.scripting.InjectionTarget[] = [
        { tabId, allFrames: true },
        { tabId },
    ];

    for (const target of targets) {
        try {
            const results = await chrome.scripting.executeScript({
                target,
                func: captureLargestVideo,
                args: [maxWidth],
            });
            let best: FrameSnapshot | null = null;
            results.forEach(({ result }) => {
                const snapshot = result as FrameSnapshot | null | undefined;
                if (snapshot && (!best || snapshot.area > best.area)) {
                    best = snapshot;
                }
            });
            if (!best) return null;
            const { src, width, height } = best as FrameSnapshot;
            return { src, width, height };
        } catch {
            continue;
        }
    }

    return null;
};
