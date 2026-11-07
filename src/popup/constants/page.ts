import { PageStatusKind } from 'src/popup/enums/pageStatus';
import type { PageStatus } from 'src/popup/types/page';

export const INITIAL_STATUS: PageStatus = {
    kind: PageStatusKind.Loading,
    videoCount: 0,
};

export const PAGE_RETRY_MS = 700;
