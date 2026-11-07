import { runCommand } from 'src/worker/services/commands';

let queue = Promise.resolve();

chrome.commands.onCommand.addListener((command, tab) => {
    queue = queue.then(() => runCommand(command, tab)).catch(console.error);
});
