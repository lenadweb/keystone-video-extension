import { FC } from 'react';
import cn from 'classnames';
import {
    LucideIcon,
    Minus,
    MoveHorizontal,
    MoveVertical,
    Plus,
} from 'lucide-react';
import {
    formatPercent,
    horizontalTilt,
    LIMIT,
    SLIDER_STEP,
    verticalTilt,
} from 'src/shared/keystone';
import { I18nKey, t } from 'src/shared/i18n';
import { Command, Shortcuts } from 'src/shared/commands';
import IconButton, { IconButtonTone } from 'src/popup/components/IconButton';
import Slider from 'src/popup/components/Slider';
import Tooltip, { TooltipAlign } from 'src/popup/components/Tooltip';

export type Axis = 'vertical' | 'horizontal';

type AxisConfig = {
    title: I18nKey;
    icon: LucideIcon;
    positiveLabel: I18nKey;
    negativeLabel: I18nKey;
    positiveAction: I18nKey;
    negativeAction: I18nKey;
    positiveCommand: Command;
    negativeCommand: Command;
    resetLabel: I18nKey;
};

const AXES: Record<Axis, AxisConfig> = {
    vertical: {
        title: 'vertical',
        icon: MoveVertical,
        positiveLabel: 'top_narrower',
        negativeLabel: 'bottom_narrower',
        positiveAction: 'narrow_top',
        negativeAction: 'narrow_bottom',
        positiveCommand: Command.NarrowTop,
        negativeCommand: Command.NarrowBottom,
        resetLabel: 'reset_vertical',
    },
    horizontal: {
        title: 'horizontal',
        icon: MoveHorizontal,
        positiveLabel: 'right_narrower',
        negativeLabel: 'left_narrower',
        positiveAction: 'narrow_right',
        negativeAction: 'narrow_left',
        positiveCommand: Command.NarrowRight,
        negativeCommand: Command.NarrowLeft,
        resetLabel: 'reset_horizontal',
    },
};

type Props = {
    axis: Axis;
    value: number;
    step: number;
    shortcuts: Shortcuts;
    onChange: (value: number) => void;
};

const CorrectionAxis: FC<Props> = ({
    axis,
    value,
    step,
    shortcuts,
    onChange,
}) => {
    const config = AXES[axis];
    const AxisIcon = config.icon;
    const isAdjusted = value !== 0;
    const tilt =
        axis === 'vertical' ? verticalTilt(value) : horizontalTilt(value);
    const valueText = isAdjusted
        ? `${formatPercent(value)} ${t(
              value > 0 ? config.positiveLabel : config.negativeLabel
          )}, ≈${tilt.toFixed(1)}°`
        : t('no_correction');

    return (
        <section aria-label={t(config.title)}>
            <div className="mb-1 flex h-8 items-center justify-between gap-3 pl-1">
                <span className="flex items-center gap-2 text-sm font-medium text-white-100">
                    <AxisIcon aria-hidden className="size-4 text-black-400" />
                    {t(config.title)}
                </span>
                <Tooltip label={t(config.resetLabel)} align={TooltipAlign.End}>
                    <button
                        type="button"
                        onClick={() => onChange(0)}
                        disabled={!isAdjusted}
                        aria-label={t(config.resetLabel)}
                        title={isAdjusted ? `≈${tilt.toFixed(1)}°` : undefined}
                        className={cn(
                            'h-8 min-w-14 rounded-full px-3 text-[13px] font-semibold tabular-nums transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-light',
                            isAdjusted
                                ? 'cursor-pointer bg-blue-accent/20 text-blue-light hover:bg-blue-accent/30 active:scale-95'
                                : 'text-black-400'
                        )}
                    >
                        {formatPercent(value)}
                    </button>
                </Tooltip>
            </div>

            <div className="flex items-center gap-2">
                <IconButton
                    icon={Minus}
                    tone={IconButtonTone.Tonal}
                    label={t(config.negativeAction)}
                    shortcut={shortcuts[config.negativeCommand]}
                    tooltipAlign={TooltipAlign.Start}
                    onClick={() => onChange(value - step)}
                />
                <Slider
                    value={value}
                    min={-LIMIT}
                    max={LIMIT}
                    step={SLIDER_STEP}
                    label={t(config.title)}
                    valueText={valueText}
                    onChange={onChange}
                />
                <IconButton
                    icon={Plus}
                    tone={IconButtonTone.Tonal}
                    label={t(config.positiveAction)}
                    shortcut={shortcuts[config.positiveCommand]}
                    tooltipAlign={TooltipAlign.End}
                    onClick={() => onChange(value + step)}
                />
            </div>
        </section>
    );
};

export default CorrectionAxis;
