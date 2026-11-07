import type { PageStatus } from 'src/popup/types/page';

export type HeaderProps = {
    isEnabled: boolean;
    status: PageStatus;
    toggleShortcut?: string;
    onToggle: () => void;
};
