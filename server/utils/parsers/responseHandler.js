// const { fileCmdHandler } = require("./files.js")

// exports.responseHandler = async (message) => {

//     let tasksListString;

//     let startIndexOfTask = message.indexOf("##[run-task]");
//     let endIndexOfTask = message.indexOf("##[end-task]");


//     if (startIndexOfTask === -1) {
//         return;
//     }
//     else{
//         tasksListString = message.substring(startIndexOfTask+12, endIndexOfTask-1);
//     }

//     let tasksList = tasksListString.split("\n");
//     tasksList = tasksList.filter(task => task !== "");

//     for (let task of tasksList) {
//         if (task.includes("##[file-create]")){
//             fileCmdHandler(task);
//         }
//     }

//     console.log(tasksListString)
//     console.log(tasksList);
//     return;

// };