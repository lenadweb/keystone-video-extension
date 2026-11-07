export type VideoSnapshot = {
    src: string;
    width: number;
    height: number;
};

export type FrameSnapshot = VideoSnapshot & { area: number };

export type SnapshotOptions = {
    maxWidth: number;
    sampleStride: number;
    blankThreshold: number;
    mimeType: string;
    quality: number;
};
