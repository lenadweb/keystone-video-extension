export const executeInTabFrames = async <T>(
    tabId: number,
    inject: (target: chrome.scripting.InjectionTarget) => Promise<T>
): Promise<T> => {
    let lastError: unknown;
    for (const target of [{ tabId, allFrames: true }, { tabId }]) {
        try {
            return await inject(target);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError ?? new Error('Unable to inspect the active tab');
};

export const injectContentScript = (tabId: number): Promise<unknown> =>
    executeInTabFrames(tabId, (target) =>
        chrome.scripting.executeScript({ target, files: ['content.js'] })
    );
