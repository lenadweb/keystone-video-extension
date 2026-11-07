import assert from 'node:assert/strict';
import { test } from 'node:test';
import { StyleProperty } from '../src/content/enums/styleProperty';
import type { StyleValues } from '../src/content/types/videoStyles';
import {
    adoptSiteStyles,
    createStyleBackup,
    recordAppliedStyles,
} from '../src/content/utils/styleBackup';

const styles: StyleValues = {
    [StyleProperty.Transform]: { value: 'scale(0.9)', priority: 'important' },
    [StyleProperty.TransformOrigin]: { value: '50% 50%', priority: '' },
    [StyleProperty.WillChange]: { value: '', priority: '' },
};

test('site changes replace restoration values without mutating an existing backup', () => {
    const backup = recordAppliedStyles(createStyleBackup(styles), {
        ...styles,
        [StyleProperty.Transform]: {
            value: 'matrix3d(1)',
            priority: 'important',
        },
    });
    const original = structuredClone(backup);
    const next = adoptSiteStyles(backup, {
        ...styles,
        [StyleProperty.Transform]: { value: 'scale(0.8)', priority: '' },
    });
    assert.deepEqual(next.original[StyleProperty.Transform], {
        value: 'scale(0.8)',
        priority: '',
    });
    assert.deepEqual(backup, original);
    const unchanged = adoptSiteStyles(backup, {
        ...styles,
        [StyleProperty.Transform]: {
            value: 'matrix3d(1)',
            priority: 'important',
        },
    });
    assert.deepEqual(
        unchanged.original[StyleProperty.Transform],
        styles[StyleProperty.Transform]
    );
});
