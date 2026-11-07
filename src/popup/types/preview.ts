import type { VideoSnapshot } from 'src/popup/types/snapshot';

export type PreviewProps = {
    vertical: number;
    horizontal: number;
    isEnabled: boolean;
    snapshot: VideoSnapshot | null;
    shortcut?: string;
    onReset: () => void;
};
