import type { LucideIcon } from 'lucide-react';
import type { Command } from 'src/shared/enums/command';
import type { I18nKey } from 'src/shared/types/i18n';

export type AxisConfig = {
    title: I18nKey;
    icon: LucideIcon;
    positiveLabel: I18nKey;
    negativeLabel: I18nKey;
    positiveAction: I18nKey;
    negativeAction: I18nKey;
    positiveCommand: Command;
    negativeCommand: Command;
    resetLabel: I18nKey;
};
