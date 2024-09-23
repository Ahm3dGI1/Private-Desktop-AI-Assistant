import { fileCmdHandler } from "./files.js"

export const responseHandler = async (message) => {

    // Check if the message is a command
    let tasksListString;

    let startIndexOfTask = message.indexOf("##[run-task]");
    let endIndexOfTask = message.indexOf("##[end-task]");


    if (startIndexOfTask === -1) {
        return;
    }
    else{
        tasksListString = message.substring(startIndexOfTask+12, endIndexOfTask-1);
    }

    let tasksList = tasksListString.split("\n");
    tasksList = tasksList.filter(task => task !== "");

    console.log(tasksListString)
    console.log(tasksList);
    return;

}