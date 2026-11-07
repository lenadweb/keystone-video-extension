import type { CSSProperties } from 'react';
import { CLEARANCE, HANDLE } from 'src/popup/constants/slider';

export const getSliderStyle = (
    value: number,
    min: number,
    max: number
): CSSProperties => ({ '--p': (value - min) / (max - min) }) as CSSProperties;

export const getSliderActiveStyle = (value: number): CSSProperties =>
    value > 0
        ? {
              left: '50%',
              width: `max(0px, calc(${HANDLE} - ${CLEARANCE} - 50%))`,
          }
        : {
              left: `calc(${HANDLE} + ${CLEARANCE})`,
              width: `max(0px, calc(50% - ${HANDLE} - ${CLEARANCE}))`,
          };
