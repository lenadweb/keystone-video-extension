import assert from 'node:assert/strict';
import { test } from 'node:test';
import { executeInTabFrames } from '../src/popup/services/scripting';

test('frame execution retries the top frame when all-frame access is restricted', async () => {
    const calls: chrome.scripting.InjectionTarget[] = [];
    const value = await executeInTabFrames(42, async (target) => {
        calls.push(target);
        if (target.allFrames) throw new Error('Restricted embedded frame');
        return 7;
    });
    assert.equal(value, 7);
    assert.deepEqual(calls, [{ tabId: 42, allFrames: true }, { tabId: 42 }]);
    await assert.rejects(
        executeInTabFrames(42, async () => {
            throw new Error('Restricted tab');
        }),
        /Restricted tab/
    );
});
