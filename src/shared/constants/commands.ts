import { Axis } from 'src/shared/enums/axis';
import { Command } from 'src/shared/enums/command';

export const NUDGES: Partial<Record<Command, [Axis, 1 | -1]>> = {
    [Command.NarrowTop]: [Axis.Vertical, 1],
    [Command.NarrowBottom]: [Axis.Vertical, -1],
    [Command.NarrowLeft]: [Axis.Horizontal, -1],
    [Command.NarrowRight]: [Axis.Horizontal, 1],
};
