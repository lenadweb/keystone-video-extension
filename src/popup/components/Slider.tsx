import cn from 'classnames';
import type { FC } from 'react';
import { CLEARANCE, HANDLE } from 'src/popup/constants/slider';
import type { SliderProps } from 'src/popup/types/slider';
import { getSliderActiveStyle, getSliderStyle } from 'src/popup/utils/slider';

const Slider: FC<SliderProps> = ({
    value,
    min,
    max,
    step,
    label,
    valueText,
    onChange,
}) => {
    const style = getSliderStyle(value, min, max);
    const activeStyle = getSliderActiveStyle(value);

    return (
        <div
            className="keystone-slider relative h-11 min-w-0 flex-1"
            style={style}
        >
            <span
                aria-hidden
                className="absolute top-1/2 left-0 h-4 -translate-y-1/2 rounded-l-lg rounded-r-[2px] bg-black-600"
                style={{ width: `max(0px, calc(${HANDLE} - ${CLEARANCE}))` }}
            />
            <span
                aria-hidden
                className="absolute top-1/2 right-0 h-4 -translate-y-1/2 rounded-l-[2px] rounded-r-lg bg-black-600"
                style={{ left: `calc(${HANDLE} + ${CLEARANCE})` }}
            />
            <span
                aria-hidden
                className="absolute top-1/2 h-4 -translate-y-1/2 rounded-[2px] bg-blue-light"
                style={activeStyle}
            />
            <span
                aria-hidden
                className="absolute top-1/2 left-1.5 size-1 -translate-y-1/2 rounded-full bg-black-400"
            />
            <span
                aria-hidden
                className="absolute top-1/2 right-1.5 size-1 -translate-y-1/2 rounded-full bg-black-400"
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                aria-label={label}
                aria-valuetext={valueText}
                onChange={(event) => onChange(Number(event.target.value))}
                className="keystone-range peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
                aria-hidden
                className={cn(
                    'absolute top-0 h-11 w-1 -translate-x-1/2 rounded-full bg-blue-light transition-[width,box-shadow] duration-150',
                    'peer-active:w-0.5 peer-focus-visible:shadow-[0_0_0_3px_rgb(79_139_255/35%)]'
                )}
                style={{ left: HANDLE }}
            />
        </div>
    );
};

export default Slider;
