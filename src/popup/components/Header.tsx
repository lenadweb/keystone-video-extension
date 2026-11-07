import { FC } from 'react';
import cn from 'classnames';
import { t } from 'src/shared/i18n';
import { Keyboard } from 'lucide-react';
import { SHORTCUTS_PAGE } from 'src/shared/commands';
import IconButton from 'src/popup/components/IconButton';
import Logo from 'src/assets/icons/logo.svg?react';
import { PageStatus, PageStatusKind } from 'src/popup/pageStatus';
import Switch from 'src/popup/components/Switch';
import Tooltip, {
    TooltipAlign,
    TooltipPlacement,
} from 'src/popup/components/Tooltip';

type Props = {
    isEnabled: boolean;
    status: PageStatus;
    toggleShortcut?: string;
    onToggle: () => void;
};

const getStatusLabel = ({ kind, videoCount }: PageStatus): string => {
    switch (kind) {
        case PageStatusKind.Ready:
            return videoCount === 1
                ? t('video_found')
                : t('videos_found', [String(videoCount)]);
        case PageStatusKind.NoVideos:
            return t('no_videos');
        case PageStatusKind.Unavailable:
            return t('page_unavailable');
        default:
            return t('checking_page');
    }
};

const getStatusDotClass = (status: PageStatus, isEnabled: boolean): string => {
    switch (status.kind) {
        case PageStatusKind.Loading:
            return 'animate-pulse bg-black-500';
        case PageStatusKind.Ready:
            return isEnabled ? 'bg-blue-light' : 'bg-black-400';
        case PageStatusKind.Unavailable:
            return 'bg-danger';
        default:
            return 'bg-black-500';
    }
};

const Header: FC<Props> = ({ isEnabled, status, toggleShortcut, onToggle }) => {
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
                    <div
                        className="flex min-w-0 items-center gap-1.5"
                        title={
                            status.kind === PageStatusKind.Unavailable
                                ? t('page_unavailable_hint')
                                : undefined
                        }
                    >
                        <span
                            aria-hidden
                            className={cn(
                                'size-1.5 shrink-0 rounded-full',
                                getStatusDotClass(status, isEnabled)
                            )}
                        />
                        <span
                            role="status"
                            aria-live="polite"
                            className="truncate text-[12px] leading-4 text-black-400"
                        >
                            {getStatusLabel(status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <IconButton
                    icon={Keyboard}
                    label={t('shortcuts')}
                    tooltipPlacement={TooltipPlacement.Bottom}
                    onClick={() => {
                        chrome.tabs
                            .create({ url: SHORTCUTS_PAGE })
                            .catch(console.error);
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
