import { useCallback, useEffect, useRef, useState } from 'react';
import {
    KeystoneSettings,
    loadSettings,
    normalizeSettings,
    onSettingsChange,
    saveSettings,
} from 'src/shared/settings';

export type KeystoneSettingsController = {
    settings: KeystoneSettings | null;
    update: (patch: Partial<KeystoneSettings>) => void;
    resetCorrection: () => void;
};

export const useKeystoneSettings = (): KeystoneSettingsController => {
    const [settings, setSettings] = useState<KeystoneSettings | null>(null);
    const latest = useRef<KeystoneSettings | null>(null);

    useEffect(() => {
        let disposed = false;

        const sync = (next: KeystoneSettings) => {
            latest.current = next;
            if (!disposed) setSettings(next);
        };

        loadSettings().then(sync).catch(console.error);
        const unsubscribe = onSettingsChange(sync);

        return () => {
            disposed = true;
            unsubscribe();
        };
    }, []);

    const update = useCallback((patch: Partial<KeystoneSettings>) => {
        const current = latest.current;
        if (!current) return;

        const next = normalizeSettings({ ...current, ...patch });
        latest.current = next;
        setSettings(next);
        saveSettings(next).catch(console.error);
    }, []);

    const resetCorrection = useCallback(
        () => update({ vertical: 0, horizontal: 0 }),
        [update]
    );

    return { settings, update, resetCorrection };
};
