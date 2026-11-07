import { TooltipAlign, TooltipPlacement } from 'src/popup/enums/tooltip';

export const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
    [TooltipPlacement.Top]: 'bottom-full mb-1.5 translate-y-1',
    [TooltipPlacement.Bottom]: 'top-full mt-1.5 -translate-y-1',
};

export const ALIGN_CLASSES: Record<TooltipAlign, string> = {
    [TooltipAlign.Start]: 'left-0',
    [TooltipAlign.Center]: 'left-1/2 -translate-x-1/2',
    [TooltipAlign.End]: 'right-0',
};
