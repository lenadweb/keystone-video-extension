import { createOsdController } from 'src/content/controllers/osd';
import { createVideoCorrection } from 'src/content/controllers/videoCorrection';
import { observePageLifecycle } from 'src/content/dom/pageLifecycle';
import { correctionSummary } from 'src/content/utils/summary';
import { DEFAULT_SETTINGS } from 'src/shared/constants/settings';
import { MessageType } from 'src/shared/enums/message';
import { loadSettings, onSettingsChange } from 'src/shared/services/settings';
import type { OsdMessage } from 'src/shared/types/commands';
import type { Dispose } from 'src/shared/types/lifecycle';
import type { KeystoneSettings } from 'src/shared/types/settings';

export const startContent = (): Dispose => {
    let settings: KeystoneSettings = { ...DEFAULT_SETTINGS };
    let settingsRevision = 0;
    let destroyed = false;
    const correction = createVideoCorrection(() => settings);
    const osd = createOsdController();
    const applySettings = (next: KeystoneSettings): void => {
        settings = next;
        settingsRevision += 1;
        correction.refresh();
    };
    const unsubscribe = onSettingsChange((next) => {
        if (!destroyed) applySettings(next);
    });
    const load = async (): Promise<void> => {
        const request = settingsRevision;
        try {
            const loaded = await loadSettings();
            if (!destroyed && request === settingsRevision)
                applySettings(loaded);
        } catch (error) {
            console.error('Keystone: unable to load settings', error);
        }
    };
    const handleMessage = (message: unknown): void => {
        const payload = message as OsdMessage | null;
        if (payload?.type !== MessageType.Osd || !correction.hasVisibleVideo())
            return;
        osd.show(correctionSummary(payload.settings), payload.settings.enabled);
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    const stopLifecycle = observePageLifecycle({
        onFullscreen: () => {
            osd.hide();
            correction.reapply();
        },
        onResize: correction.refresh,
        onRestore: () => {
            load().catch(console.error);
            correction.reapply();
        },
        onVisible: correction.reapply,
    });
    load();
    return () => {
        destroyed = true;
        correction.destroy();
        chrome.runtime.onMessage.removeListener(handleMessage);
        unsubscribe();
        stopLifecycle();
        osd.hide();
    };
};
