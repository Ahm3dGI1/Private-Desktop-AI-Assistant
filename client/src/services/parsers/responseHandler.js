import { fileCmdHandler } from "./files.js"

export const responseHandler = async (response) => {
    if (!response.ok) {
        return;
    }

    const json = await response.json();
    let message = json.message.content;

    // Check if the message is a command
    


    // ##[file]:<cmdType> <detail1> <detail2> ... ##[cmd]: <cmdType> <detail1> <detail2> ...

}