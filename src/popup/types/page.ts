import type { PageStatusKind } from 'src/popup/enums/pageStatus';

export type PageStatus = {
    kind: PageStatusKind;
    videoCount: number;
};
