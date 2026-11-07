import type { PageLifecycleHandlers } from 'src/content/types/controllers';
import type { Dispose } from 'src/shared/types/lifecycle';

export const observePageLifecycle = ({
    onFullscreen,
    onResize,
    onRestore,
    onVisible,
}: PageLifecycleHandlers): Dispose => {
    const onPageShow = (event: PageTransitionEvent): void => {
        if (event.persisted) onRestore();
    };
    const onVisibility = (): void => {
        if (document.visibilityState === 'visible') onVisible();
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('webkitfullscreenchange', onFullscreen);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    window.addEventListener('pageshow', onPageShow);
    return () => {
        document.removeEventListener('fullscreenchange', onFullscreen);
        document.removeEventListener('webkitfullscreenchange', onFullscreen);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pageshow', onPageShow);
    };
};
