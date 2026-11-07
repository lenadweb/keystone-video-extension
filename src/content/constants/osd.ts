export const HOST_ID = 'keystone-osd';

export const VISIBLE_MS = 1600;

export const FADE_MS = 180;

export const STYLE = `
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

export const HOST_STYLE = [
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
