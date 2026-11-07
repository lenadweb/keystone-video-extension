import { MoveHorizontal, MoveVertical } from 'lucide-react';
import type { AxisConfig } from 'src/popup/types/axis';
import { Axis } from 'src/shared/enums/axis';
import { Command } from 'src/shared/enums/command';

export const AXES: Record<Axis, AxisConfig> = {
    [Axis.Vertical]: {
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
    [Axis.Horizontal]: {
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
