import type { Step } from 'src/shared/enums/step';

export type KeystoneSettings = {
    enabled: boolean;
    vertical: number;
    horizontal: number;
    step: Step;
};
