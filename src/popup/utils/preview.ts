import { BOX_HEIGHT, BOX_WIDTH } from 'src/popup/constants/preview';
import type { Dimensions } from 'src/shared/types/geometry';

export const fitFrame = (aspect: number): Dimensions => {
    const width = Math.min(BOX_WIDTH, BOX_HEIGHT * aspect);
    return { width: Math.round(width), height: Math.round(width / aspect) };
};
