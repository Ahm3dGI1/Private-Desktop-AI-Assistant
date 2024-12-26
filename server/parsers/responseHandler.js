const { fileCmdHandler } = require("./files.js");
const { calendarCmdHandler } = require("./calendar.js");
const { gmailCmdHandler } = require("./gmail.js");
const { contactsCmdHandler } = require("./contacts.js");
const { githubCmdHandler } = require("./github.js");
const { newsCmdHandler } = require("./news.js");

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
        return "No tasks to execute.";
    }

    const taskHandlers = {
        "file-edit": fileCmdHandler,
        "file-create": fileCmdHandler,
        "calendar-list": calendarCmdHandler,
        "calendar-add": calendarCmdHandler,
        "gmail-list": gmailCmdHandler,
        "gmail-messages": gmailCmdHandler,
        "gmail-send": gmailCmdHandler,
        "contacts-list": contactsCmdHandler,
        "github-list-repos": githubCmdHandler,
        "github-create-repo": githubCmdHandler,
        "news-list": newsCmdHandler,
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
            console.log(`Executing task: ${taskName} with parameters:`, taskParams);
            const result = await taskHandler(taskParams);
            taskResultText += result ? `${result}\n` : `Task ${taskName} completed.\n`;
        } catch (error) {
            console.error(`Error executing task: ${taskName}`, error);
            taskResultText += `Failed to execute task: ${taskName}\n`;
        }
    }

    return taskResultText.trim();
}

module.exports = {
    responseHandler,
};
