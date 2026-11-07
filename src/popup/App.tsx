import { FC } from 'react';
import cn from 'classnames';
import { t } from 'src/shared/i18n';
import { useKeystoneSettings } from 'src/popup/hooks/useKeystoneSettings';
import { usePageStatus } from 'src/popup/hooks/usePageStatus';
import { useShortcuts } from 'src/popup/hooks/useShortcuts';
import { Command } from 'src/shared/commands';
import { useVideoSnapshot } from 'src/popup/hooks/useVideoSnapshot';
import { PageStatusKind } from 'src/popup/pageStatus';
import CorrectionAxis from 'src/popup/components/CorrectionAxis';
import Footer from 'src/popup/components/Footer';
import Header from 'src/popup/components/Header';
import Preview from 'src/popup/components/Preview';
import StepSelector from 'src/popup/components/StepSelector';

const App: FC = () => {
    const { settings, update, resetCorrection } = useKeystoneSettings();
    const pageStatus = usePageStatus();
    const shortcuts = useShortcuts();
    const snapshot = useVideoSnapshot(pageStatus.kind === PageStatusKind.Ready);

    if (!settings) return null;

    return (
        <main className="flex min-h-[480px] w-[360px] flex-col bg-background p-3 pt-5 text-white">
            <Header
                isEnabled={settings.enabled}
                status={pageStatus}
                toggleShortcut={shortcuts[Command.Toggle]}
                onToggle={() => update({ enabled: !settings.enabled })}
            />

            <div className="space-y-2.5">
                <Preview
                    vertical={settings.vertical}
                    horizontal={settings.horizontal}
                    isEnabled={settings.enabled}
                    snapshot={snapshot}
                    shortcut={shortcuts[Command.Reset]}
                    onReset={resetCorrection}
                />

                <div
                    aria-label={t('settings')}
                    className={cn(
                        'space-y-4 rounded-3xl bg-black-700 p-4 transition-opacity duration-200',
                        !settings.enabled && 'opacity-50'
                    )}
                >
                    <CorrectionAxis
                        axis="vertical"
                        value={settings.vertical}
                        step={settings.step}
                        shortcuts={shortcuts}
                        onChange={(vertical) => update({ vertical })}
                    />
                    <CorrectionAxis
                        axis="horizontal"
                        value={settings.horizontal}
                        step={settings.step}
                        shortcuts={shortcuts}
                        onChange={(horizontal) => update({ horizontal })}
                    />
                    <div className="h-px bg-black-600" />
                    <StepSelector
                        value={settings.step}
                        onChange={(step) => update({ step })}
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default App;
