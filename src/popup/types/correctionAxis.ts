import type { Axis } from 'src/shared/enums/axis';
import type { Shortcuts } from 'src/shared/types/commands';

export type CorrectionAxisProps = {
    axis: Axis;
    value: number;
    step: number;
    shortcuts: Shortcuts;
    onChange: (value: number) => void;
};
