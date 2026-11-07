import type { Dispose } from 'src/shared/types/lifecycle';

export type KeystoneContent = { version: string; destroy: Dispose };

export type VideoVisitor = (video: HTMLVideoElement) => void;
