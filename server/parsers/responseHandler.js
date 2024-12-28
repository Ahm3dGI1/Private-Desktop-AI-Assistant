const { fileCMDHandler } = require("./files.js");
const { calendarCMDHandler } = require("./calendar.js");
const { gmailCMDHandler } = require("./gmail.js");
const { contactsCMDHandler } = require("./contacts.js");
const { githubCMDHandler } = require("./github.js");
const { newsCMDHandler } = require("./news.js");

/**
 * A parser that takes the AI response and handles the tasks accordingly.
 * 
 * @param {Array<Object>} tasksList - The list of tasks to be executed.
 * Each task object should have the following structure:
 * {
 *   command: "<task-command>",
 *   parameters: { ...task-parameters }
 * }
 * 
 * @returns {string} - The concatenated results of all the executed tasks.
 */
async function responseHandler(tasksList) {
    if (!tasksList || tasksList.length === 0) {
        return "";
    }

    const taskHandlers = {
        "file-edit": fileCMDHandler,
        "file-create": fileCMDHandler,
        "file-append": fileCMDHandler,
        "calendar-list": calendarCMDHandler,
        "calendar-add": calendarCMDHandler,
        "gmail-list": gmailCMDHandler,
        "gmail-messages": gmailCMDHandler,
        "gmail-send": gmailCMDHandler,
        "contacts-list": contactsCMDHandler,
        "github-list-repos": githubCMDHandler,
        "github-create-repo": githubCMDHandler,
        "news-list": newsCMDHandler,
    };

    let taskResultText = "";

    for (const task of tasksList) {
        const { command: taskName, parameters: taskParams } = task;
        const taskHandler = taskHandlers[taskName];

        if (!taskHandler) {
            console.warn(`No handler found for task: ${taskName}`);
            taskResultText += `Unrecognized task: ${taskName}\n`;
            continue;
        }

        try {
            for (const key in taskParams) {
                if (taskParams[key] === "{last-response}") {
                    taskParams[key] = taskResultText;
                }
            }
            
            console.log(`Executing task: ${taskName} with parameters:`, taskParams);
            const result = await taskHandler(taskName, taskParams);
            taskResultText += result ? `${result}\n` : `Task ${taskName} completed.\n`;
        } catch (error) {
            console.error(`Error executing task: ${taskName}`, error);
            taskResultText += `Failed to execute task: ${taskName}\n`;
        }
    }

    return taskResultText.trim();
}

responseHandler([
    { command: 'gmail-messages', parameters: { messagesNo: 10 } },
    { command: 'file-create', parameters: { fname: 'emails.txt', content: '{last-response}' } }
  ])

module.exports = {
    responseHandler,
};
