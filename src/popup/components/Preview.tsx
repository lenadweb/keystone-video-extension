import { CSSProperties, FC, useState } from 'react';
import cn from 'classnames';
import { RotateCcw } from 'lucide-react';
import { buildMatrix3d } from 'src/shared/keystone';
import { t } from 'src/shared/i18n';
import { VideoSnapshot } from 'src/popup/snapshot';
import IconButton from 'src/popup/components/IconButton';
import { TooltipAlign } from 'src/popup/components/Tooltip';

type Props = {
    vertical: number;
    horizontal: number;
    isEnabled: boolean;
    snapshot: VideoSnapshot | null;
    shortcut?: string;
    onReset: () => void;
};

const BOX_WIDTH = 220;
const BOX_HEIGHT = 112;
const DEFAULT_ASPECT = 16 / 9;

const fitFrame = (aspect: number): { width: number; height: number } => {
    const width = Math.min(BOX_WIDTH, BOX_HEIGHT * aspect);
    return { width: Math.round(width), height: Math.round(width / aspect) };
};

const Preview: FC<Props> = ({
    vertical,
    horizontal,
    isEnabled,
    snapshot,
    shortcut,
    onReset,
}) => {
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const isAdjusted = vertical !== 0 || horizontal !== 0;
    const aspect = snapshot ? snapshot.width / snapshot.height : DEFAULT_ASPECT;
    const frame = fitFrame(aspect);
    const matrix = isEnabled
        ? buildMatrix3d(vertical, horizontal, frame.width, frame.height)
        : null;
    const surfaceStyle: CSSProperties = {
        transformOrigin: '0 0',
        transform: matrix ?? 'none',
    };
    const hasImage = snapshot !== null && loadedSrc === snapshot.src;

    return (
        <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-3xl bg-black-700">
            <div
                className="relative transition-[width,height] duration-300"
                style={frame}
            >
                <div className="absolute -inset-px rounded-[3px] border border-dashed border-black-500" />
                <div
                    className={cn(
                        'absolute inset-0 overflow-hidden transition-[transform,filter,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
                        !isEnabled && 'opacity-50 grayscale'
                    )}
                    style={surfaceStyle}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-blue-light to-blue-accent" />
                    {snapshot && (
                        <img
                            key={snapshot.src}
                            src={snapshot.src}
                            alt=""
                            draggable={false}
                            onLoad={() => setLoadedSrc(snapshot.src)}
                            className={cn(
                                'absolute inset-0 size-full object-cover transition-opacity duration-300',
                                hasImage ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                    )}
                </div>
            </div>
            <div
                className={cn(
                    'absolute top-2 right-2 transition duration-200',
                    isAdjusted
                        ? 'scale-100 opacity-100'
                        : 'pointer-events-none scale-75 opacity-0'
                )}
                inert={!isAdjusted}
            >
                <IconButton
                    icon={RotateCcw}
                    label={t('reset_correction')}
                    shortcut={shortcut}
                    tooltipAlign={TooltipAlign.End}
                    onClick={onReset}
                />
            </div>
        </div>
    );
};

export default Preview;
