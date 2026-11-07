import { PageStatusKind } from 'src/popup/enums/pageStatus';
import type { PageStatus } from 'src/popup/types/page';
import type { Translate } from 'src/shared/types/i18n';

export const getStatusLabel = (
    { kind, videoCount }: PageStatus,
    translate: Translate
): string => {
    switch (kind) {
        case PageStatusKind.Ready:
            return videoCount === 1
                ? translate('video_found')
                : translate('videos_found', [String(videoCount)]);
        case PageStatusKind.NoVideos:
            return translate('no_videos');
        case PageStatusKind.Unavailable:
            return translate('page_unavailable');
        default:
            return translate('checking_page');
    }
};

export const getStatusDotClass = (
    status: PageStatus,
    isEnabled: boolean
): string => {
    switch (status.kind) {
        case PageStatusKind.Loading:
            return 'animate-pulse bg-black-500';
        case PageStatusKind.Ready:
            return isEnabled ? 'bg-blue-light' : 'bg-black-400';
        case PageStatusKind.Unavailable:
            return 'bg-danger';
        default:
            return 'bg-black-500';
    }
};
