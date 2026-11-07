import cn from 'classnames';
import { Keyboard } from 'lucide-react';
import type { FC } from 'react';
import type { HeaderProps } from 'src/popup/types/header';
import { t } from 'src/shared/services/i18n';
import { openShortcutsPage } from 'src/shared/services/tabs';

import Logo from 'src/assets/icons/logo.svg?react';
import IconButton from 'src/popup/components/IconButton';
import Switch from 'src/popup/components/Switch';
import Tooltip from 'src/popup/components/Tooltip';
import { TooltipAlign, TooltipPlacement } from 'src/popup/enums/tooltip';

const Header: FC<HeaderProps> = ({ isEnabled, toggleShortcut, onToggle }) => {
    const toggleLabel = t(
        isEnabled ? 'disable_correction' : 'enable_correction'
    );

    return (
        <div className="mb-4 ml-2 flex shrink-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
                <Logo
                    aria-hidden
                    className={cn(
                        'size-8 shrink-0 transition duration-150',
                        !isEnabled && 'grayscale'
                    )}
                />
                <div className="min-w-0">
                    <h1 className="text-[20px] font-medium leading-tight">
                        {t('app_title')}
                    </h1>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <IconButton
                    icon={Keyboard}
                    label={t('shortcuts')}
                    tooltipPlacement={TooltipPlacement.Bottom}
                    onClick={() => {
                        openShortcutsPage().catch(console.error);
                    }}
                />
                <Tooltip
                    label={toggleLabel}
                    shortcut={toggleShortcut}
                    placement={TooltipPlacement.Bottom}
                    align={TooltipAlign.End}
                >
                    <Switch
                        isOn={isEnabled}
                        label={toggleLabel}
                        onToggle={onToggle}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default Header;
