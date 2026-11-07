import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/shared/settings';
import { nextSettings } from '../src/shared/commandSettings';
import { Command } from '../src/shared/commands';

test('untrusted stored settings use safe defaults and bounded values', () => {
    for (const value of [null, undefined, 'text', []])
        assert.deepEqual(normalizeSettings(value), DEFAULT_SETTINGS);
    assert.deepEqual(
        normalizeSettings({
            enabled: 'false',
            vertical: 99,
            horizontal: '-3.5',
            step: 7,
        }),
        {
            enabled: true,
            vertical: 20,
            horizontal: -3.5,
            step: 0.1,
        }
    );
});

test('commands select the correct edge and respect the step size', () => {
    for (const [command, axis, value] of [
        [Command.NarrowTop, 'vertical', 0.5],
        [Command.NarrowBottom, 'vertical', -0.5],
        [Command.NarrowLeft, 'horizontal', -0.5],
        [Command.NarrowRight, 'horizontal', 0.5],
    ] as const) {
        const next = nextSettings(command, { ...DEFAULT_SETTINGS, step: 0.5 });
        assert.equal(next?.[axis], value);
    }
    assert.equal(
        normalizeSettings(
            nextSettings(Command.NarrowTop, {
                ...DEFAULT_SETTINGS,
                vertical: 20,
            })
        ).vertical,
        20
    );
});

test('disabled correction ignores nudges and can be toggled back on', () => {
    const disabled = { ...DEFAULT_SETTINGS, enabled: false, vertical: 4 };
    assert.equal(nextSettings(Command.NarrowTop, disabled), null);
    assert.equal(nextSettings(Command.Reset, disabled), null);
    assert.equal(nextSettings(Command.Toggle, disabled)?.enabled, true);
    assert.equal(nextSettings('unknown', DEFAULT_SETTINGS), null);
    assert.equal(
        nextSettings(Command.Reset, { ...DEFAULT_SETTINGS, vertical: 8 })
            ?.vertical,
        0
    );
});
