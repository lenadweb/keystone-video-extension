import { IconButtonTone } from 'src/popup/enums/iconButton';

export const TONE_CLASSES: Record<IconButtonTone, string> = {
    [IconButtonTone.Standard]:
        'text-black-200 hover:bg-white/8 hover:text-white active:bg-white/12',
    [IconButtonTone.Tonal]:
        'bg-black-600 text-white-100 hover:bg-black-500 active:bg-black-500',
};
