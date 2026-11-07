import { FC } from 'react';
import cn from 'classnames';
import { Check } from 'lucide-react';

type Props = {
    isOn: boolean;
    label: string;
    onToggle: () => void;
};

const Switch: FC<Props> = ({ isOn, label, onToggle }) => (
    <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        onClick={onToggle}
        className={cn(
            'group relative inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-light',
            isOn
                ? 'border-blue-accent bg-blue-accent'
                : 'border-black-500 bg-black-700'
        )}
    >
        <span
            className={cn(
                'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-active:size-7',
                isOn
                    ? 'left-[22px] size-6 bg-white text-blue-accent group-active:left-[20px]'
                    : 'left-1.5 size-4 bg-black-400 group-hover:bg-black-200 group-active:left-0.5'
            )}
        >
            <Check
                aria-hidden
                strokeWidth={3}
                className={cn(
                    'size-4 transition-opacity duration-200',
                    isOn ? 'opacity-100' : 'opacity-0'
                )}
            />
        </span>
    </button>
);

export default Switch;
