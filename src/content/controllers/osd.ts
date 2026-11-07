import { FADE_MS, VISIBLE_MS } from 'src/content/constants/osd';
import {
    closePopover,
    createOsdElements,
    openPopover,
} from 'src/content/dom/osd';
import type { OsdController, OsdElements } from 'src/content/types/controllers';

export const createOsdController = (): OsdController => {
    let elements: OsdElements | null = null;
    let hideTimer: number | undefined;
    let closeTimer: number | undefined;
    const clearTimers = (): void => {
        if (hideTimer !== undefined) window.clearTimeout(hideTimer);
        if (closeTimer !== undefined) window.clearTimeout(closeTimer);
        hideTimer = undefined;
        closeTimer = undefined;
    };
    const show = (message: string, enabled = true): void => {
        if (!elements?.host.isConnected) {
            elements?.host.remove();
            elements = createOsdElements();
        }
        const { host, pill, dot, text } = elements;
        if (!host.isConnected) document.documentElement.append(host);
        dot.classList.toggle('off', !enabled);
        text.textContent = message;
        openPopover(host);
        pill.classList.add('visible');
        clearTimers();
        hideTimer = window.setTimeout(() => {
            pill.classList.remove('visible');
            closeTimer = window.setTimeout(() => closePopover(host), FADE_MS);
        }, VISIBLE_MS);
    };
    const hide = (): void => {
        clearTimers();
        if (elements) {
            closePopover(elements.host);
            elements.host.remove();
        }
        elements = null;
    };
    return { show, hide };
};
