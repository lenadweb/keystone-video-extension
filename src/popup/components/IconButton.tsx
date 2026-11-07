import { FC } from 'react';
import cn from 'classnames';
import { LucideIcon } from 'lucide-react';
import Tooltip, {
    TooltipAlign,
    TooltipPlacement,
} from 'src/popup/components/Tooltip';

export enum IconButtonTone {
    Standard = 'standard',
    Tonal = 'tonal',
}

type Props = {
    icon: LucideIcon;
    label: string;
    shortcut?: string;
    tone?: IconButtonTone;
    tooltipPlacement?: TooltipPlacement;
    tooltipAlign?: TooltipAlign;
    className?: string;
    onClick: () => void;
};

const TONE_CLASSES: Record<IconButtonTone, string> = {
    [IconButtonTone.Standard]:
        'text-black-200 hover:bg-white/8 hover:text-white active:bg-white/12',
    [IconButtonTone.Tonal]:
        'bg-black-600 text-white-100 hover:bg-black-500 active:bg-black-500',
};

const IconButton: FC<Props> = ({
    icon: IconComponent,
    label,
    shortcut,
    tone = IconButtonTone.Standard,
    tooltipPlacement,
    tooltipAlign,
    className,
    onClick,
}) => (
    <Tooltip
        label={label}
        shortcut={shortcut}
        placement={tooltipPlacement}
        align={tooltipAlign}
    >
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-keyshortcuts={shortcut}
            className={cn(
                'flex size-10 cursor-pointer items-center justify-center rounded-full transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-light active:scale-90',
                TONE_CLASSES[tone],
                className
            )}
        >
            <IconComponent aria-hidden className="size-5" />
        </button>
    </Tooltip>
);

export default IconButton;
