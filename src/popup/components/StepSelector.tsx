import type { FC } from 'react';
import { useId } from 'react';
import type { StepSelectorProps } from 'src/popup/types/stepSelector';
import { STEP_OPTIONS } from 'src/shared/constants/settings';
import { t } from 'src/shared/services/i18n';
import { formatPercent } from 'src/shared/utils/percent';

const StepSelector: FC<StepSelectorProps> = ({ value, onChange }) => {
    const groupName = useId();

    return (
        <fieldset className="flex items-center justify-between gap-3 pl-1">
            <legend className="float-left text-sm font-medium text-white-100">
                {t('step_size')}
            </legend>
            <div className="flex gap-0.5">
                {STEP_OPTIONS.map((step) => (
                    <label
                        key={step}
                        className="relative cursor-pointer focus-within:z-10"
                    >
                        <input
                            type="radio"
                            name={groupName}
                            value={step}
                            checked={value === step}
                            onChange={() => onChange(step)}
                            className="peer sr-only"
                        />
                        <span className="flex h-9 min-w-14 items-center justify-center rounded-md bg-black-600 px-3 text-[13px] font-medium tabular-nums text-black-200 transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-black-500 peer-checked:rounded-[18px] peer-checked:bg-blue-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-light [label:first-child_&]:rounded-l-[18px] [label:last-child_&]:rounded-r-[18px]">
                            {formatPercent(step)}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
};

export default StepSelector;
