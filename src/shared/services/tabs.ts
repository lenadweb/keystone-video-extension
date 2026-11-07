import { SHORTCUTS_PAGE } from 'src/shared/constants/links';

export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return tab;
};

export const openShortcutsPage = (): Promise<chrome.tabs.Tab> =>
    chrome.tabs.create({ url: SHORTCUTS_PAGE });
