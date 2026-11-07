import { HOST_ID, HOST_STYLE, STYLE } from 'src/content/constants/osd';
import type { OsdElements } from 'src/content/types/controllers';

export const isPopoverOpen = (host: HTMLDivElement): boolean => {
    try {
        return host?.matches(':popover-open') ?? false;
    } catch {
        return false;
    }
};

export const openPopover = (host: HTMLDivElement): void => {
    if (!host) return;
    if (typeof host.showPopover === 'function') {
        if (!isPopoverOpen(host)) {
            try {
                host.showPopover();
            } catch {
                return;
            }
        }
        return;
    }

    const fullscreen = document.fullscreenElement;
    const container =
        fullscreen && !(fullscreen instanceof HTMLVideoElement)
            ? fullscreen
            : document.documentElement;
    if (host.parentElement !== container) container.append(host);
};

export const closePopover = (host: HTMLDivElement): void => {
    if (!host) return;
    if (typeof host.hidePopover === 'function' && isPopoverOpen(host)) {
        host.hidePopover();
    }
};

export const createOsdElements = (): OsdElements => {
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.popover = 'manual';
    host.style.cssText = HOST_STYLE;

    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLE;

    const shell = document.createElement('div');
    shell.className = 'shell';

    const pill = document.createElement('div');
    pill.className = 'pill';
    pill.setAttribute('role', 'status');
    pill.setAttribute('aria-live', 'polite');

    const dot = document.createElement('span');
    dot.className = 'dot';
    const text = document.createElement('span');
    text.className = 'text';

    pill.append(dot, text);
    shell.append(pill);
    shadow.append(style, shell);
    return { host, pill, dot, text };
};
