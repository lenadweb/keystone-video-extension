import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatShortcut } from '../src/shared/utils/shortcuts';

test('shortcut formatting takes an explicit platform and preserves native symbols', () => {
    assert.equal(formatShortcut('Alt+Shift+Up', true), '⌥⇧↑');
    assert.equal(formatShortcut('Alt+Shift+Up', false), 'Alt+Shift+↑');
    assert.equal(formatShortcut('Command+Shift+K', true), '⌘⇧K');
    assert.equal(formatShortcut('⌥⇧↑', false), '⌥⇧↑');
});
