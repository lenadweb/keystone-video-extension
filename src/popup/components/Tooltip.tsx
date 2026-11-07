import { FC, ReactNode } from 'react';
import cn from 'classnames';

export enum TooltipPlacement {
    Top = 'top',
    Bottom = 'bottom',
}

export enum TooltipAlign {
    Start = 'start',
    Center = 'center',
    End = 'end',
}

type Props = {
    label: string;
    shortcut?: string;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    children: ReactNode;
};

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
    [TooltipPlacement.Top]: 'bottom-full mb-1.5 translate-y-1',
    [TooltipPlacement.Bottom]: 'top-full mt-1.5 -translate-y-1',
};

const ALIGN_CLASSES: Record<TooltipAlign, string> = {
    [TooltipAlign.Start]: 'left-0',
    [TooltipAlign.Center]: 'left-1/2 -translate-x-1/2',
    [TooltipAlign.End]: 'right-0',
};

const Tooltip: FC<Props> = ({
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
