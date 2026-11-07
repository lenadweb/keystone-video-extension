import { useEffect, useState } from 'react';
import { loadShortcuts, Shortcuts } from 'src/shared/commands';

export const useShortcuts = (): Shortcuts => {
    const [shortcuts, setShortcuts] = useState<Shortcuts>({});

    useEffect(() => {
        let disposed = false;
        const refresh = () => {
            loadShortcuts().then((next) => {
                if (!disposed) setShortcuts(next);
            });
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => {
            disposed = true;
            window.removeEventListener('focus', refresh);
        };
    }, []);

    return shortcuts;
};
