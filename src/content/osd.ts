const HOST_ID = 'keystone-osd';
const VISIBLE_MS = 1600;
const FADE_MS = 180;

const STYLE = `
    * {
        box-sizing: border-box;
    }

    .shell {
        display: flex;
        justify-content: center;
    }

    .pill {
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: min(560px, calc(100vw - 32px));
        padding: 8px 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 9999px;
        background: rgba(24, 24, 27, 0.94);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
        color: #e4e4e7;
        font: 500 13px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-variant-numeric: tabular-nums;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 150ms ease, transform 150ms ease;
    }

    .pill.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .dot {
        flex: none;
        width: 7px;
        height: 7px;
        border-radius: 9999px;
        background: #4f8bff;
        box-shadow: 0 0 0 3px rgba(79, 139, 255, 0.16);
    }

    .dot.off {
        background: #51515c;
        box-shadow: none;
    }

    .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    @media (prefers-reduced-motion: reduce) {
        .pill {
            transition: none;
        }
    }
`;

let host: HTMLDivElement | null = null;
let pill: HTMLDivElement | null = null;
let dot: HTMLSpanElement | null = null;
let text: HTMLSpanElement | null = null;
let hideTimer: number | undefined;
let closeTimer: number | undefined;

const isPopoverOpen = (): boolean => {
    try {
        return host?.matches(':popover-open') ?? false;
    } catch {
        return false;
    }
};

const openPopover = (): void => {
    if (!host) return;
    if (typeof host.showPopover === 'function') {
        if (!isPopoverOpen()) {
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

const closePopover = (): void => {
    if (!host) return;
    if (typeof host.hidePopover === 'function' && isPopoverOpen()) {
        host.hidePopover();
    }
};

const createHost = (): void => {
    host = document.createElement('div');
    host.id = HOST_ID;
    host.popover = 'manual';
    host.style.cssText = [
        'position: fixed !important',
        'top: auto !important',
        'left: 0 !important',
        'right: 0 !important',
        'bottom: 32px !important',
        'width: auto !important',
        'height: auto !important',
        'margin: 0 !important',
        'padding: 0 !important',
        'border: 0 !important',
        'background: transparent !important',
        'overflow: visible !important',
        'z-index: 2147483647 !important',
        'pointer-events: none !important',
    ].join('; ');

    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLE;

    const shell = document.createElement('div');
    shell.className = 'shell';

    pill = document.createElement('div');
    pill.className = 'pill';
    pill.setAttribute('role', 'status');
    pill.setAttribute('aria-live', 'polite');

    dot = document.createElement('span');
    dot.className = 'dot';
    text = document.createElement('span');
    text.className = 'text';

    pill.append(dot, text);
    shell.append(pill);
    shadow.append(style, shell);
};

const ensureHost = (): void => {
    if (host?.isConnected && pill) return;
    host?.remove();
    createHost();
};

export const showOsd = (message: string, enabled = true): void => {
    ensureHost();
    if (!host || !pill || !dot || !text) return;

    if (!host.isConnected) document.documentElement.append(host);
    dot.classList.toggle('off', !enabled);
    text.textContent = message;
    openPopover();
    pill.classList.add('visible');

    if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    if (closeTimer !== undefined) window.clearTimeout(closeTimer);
    hideTimer = window.setTimeout(() => {
        pill?.classList.remove('visible');
        closeTimer = window.setTimeout(closePopover, FADE_MS);
    }, VISIBLE_MS);
};

export const hideOsd = (): void => {
    if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    if (closeTimer !== undefined) window.clearTimeout(closeTimer);
    hideTimer = undefined;
    closeTimer = undefined;
    closePopover();
    host?.remove();
    host = null;
    pill = null;
    dot = null;
    text = null;
};
