import cn from 'classnames';
import type { FC } from 'react';
import { ALIGN_CLASSES, PLACEMENT_CLASSES } from 'src/popup/constants/tooltip';
import { TooltipAlign, TooltipPlacement } from 'src/popup/enums/tooltip';
import type { TooltipProps } from 'src/popup/types/tooltip';

const Tooltip: FC<TooltipProps> = ({
    label,
    shortcut,
    placement = TooltipPlacement.Top,
    align = TooltipAlign.Center,
    children,
}) => (
    <span className="group/tooltip relative inline-flex">
        {children}
        <span
            role="tooltip"
            className={cn(
                'pointer-events-none absolute z-tooltip flex items-center gap-2 whitespace-nowrap rounded-md bg-white-100 px-2 py-1 text-[11px] leading-4 font-medium text-background opacity-0 shadow-3xl transition duration-150 delay-0 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-hover/tooltip:delay-300',
                PLACEMENT_CLASSES[placement],
                ALIGN_CLASSES[align]
            )}
        >
            {label}
            {shortcut && (
                <span className="tabular-nums text-black-500">{shortcut}</span>
            )}
        </span>
    </span>
);

export default Tooltip;
