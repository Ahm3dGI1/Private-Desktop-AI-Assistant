const { fileCmdHandler } = require("./parsers/files.js")
const { calendarCmdHandler } = require("./parsers/calendar.js")

exports.responseHandler = async (tasksList) => {

    for (let task of tasksList) {
        if (task.includes("##[file-create]")){
            console.log(`Handling file command: ${task}`);
            fileCmdHandler(task);
        }

        if (task.includes("##[calendar-list]") || task.includes("##[calendar-add]")){
            console.log(`Handling calendar command: ${task}`);
            calendarCmdHandler(task);
        }
    }
    return;
};