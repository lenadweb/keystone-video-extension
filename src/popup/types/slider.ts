export type SliderProps = {
    value: number;
    min: number;
    max: number;
    step: number;
    label: string;
    valueText: string;
    onChange: (value: number) => void;
};
