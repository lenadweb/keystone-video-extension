import cn from 'classnames';
import type { FC } from 'react';
import { TONE_CLASSES } from 'src/popup/constants/iconButton';
import { IconButtonTone } from 'src/popup/enums/iconButton';
import type { IconButtonProps } from 'src/popup/types/iconButton';

import Tooltip from 'src/popup/components/Tooltip';

const IconButton: FC<IconButtonProps> = ({
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
