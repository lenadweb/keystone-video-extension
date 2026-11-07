import type { ReactNode } from 'react';
import type { TooltipAlign, TooltipPlacement } from 'src/popup/enums/tooltip';

export type TooltipProps = {
    label: string;
    shortcut?: string;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    children: ReactNode;
};
