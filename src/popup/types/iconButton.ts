import type { LucideIcon } from 'lucide-react';
import type { IconButtonTone } from 'src/popup/enums/iconButton';
import type { TooltipAlign, TooltipPlacement } from 'src/popup/enums/tooltip';

export type IconButtonProps = {
    icon: LucideIcon;
    label: string;
    shortcut?: string;
    tone?: IconButtonTone;
    tooltipPlacement?: TooltipPlacement;
    tooltipAlign?: TooltipAlign;
    className?: string;
    onClick: () => void;
};
