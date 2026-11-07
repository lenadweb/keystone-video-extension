import type { Command } from 'src/shared/enums/command';
import type { MessageType } from 'src/shared/enums/message';
import type { KeystoneSettings } from 'src/shared/types/settings';

export type Shortcuts = Partial<Record<Command, string>>;

export type OsdMessage = { type: MessageType.Osd; settings: KeystoneSettings };
