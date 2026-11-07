import cn from 'classnames';
import { Minus, Plus } from 'lucide-react';
import type { FC } from 'react';
import { AXES } from 'src/popup/constants/axes';
import type { CorrectionAxisProps } from 'src/popup/types/correctionAxis';
import { LIMIT, SLIDER_STEP } from 'src/shared/constants/geometry';
import { Axis } from 'src/shared/enums/axis';
import { t } from 'src/shared/services/i18n';
import { horizontalTilt, verticalTilt } from 'src/shared/utils/geometry/tilt';
import { formatPercent } from 'src/shared/utils/percent';

import IconButton from 'src/popup/components/IconButton';
import Slider from 'src/popup/components/Slider';
import Tooltip from 'src/popup/components/Tooltip';
import { IconButtonTone } from 'src/popup/enums/iconButton';
import { TooltipAlign } from 'src/popup/enums/tooltip';

const CorrectionAxis: FC<CorrectionAxisProps> = ({
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
        axis === Axis.Vertical ? verticalTilt(value) : horizontalTilt(value);
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
