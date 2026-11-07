import type { Step } from 'src/shared/enums/step';

export type StepSelectorProps = {
    value: Step;
    onChange: (value: Step) => void;
};
