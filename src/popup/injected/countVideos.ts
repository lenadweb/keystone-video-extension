export const countVideosInFrame = (): number => {
    const roots: ParentNode[] = [document];
    let total = 0;
    while (roots.length) {
        const root = roots.pop()!;
        for (const video of root.querySelectorAll('video')) {
            if (
                video.isConnected &&
                video.offsetWidth > 0 &&
                video.offsetHeight > 0
            )
                total += 1;
        }
        for (const element of root.querySelectorAll('*')) {
            if (element.shadowRoot) roots.push(element.shadowRoot);
        }
    }
    return total;
};
