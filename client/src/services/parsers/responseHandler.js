import { fileCmdHandler } from "./files.js"

export const responseHandler = async (response) => {
    if (!response) {
        return;
    }
    // ##[file]:<cmdType> <detail1> <detail2> ... ##[cmd]: <cmdType> <detail1> <detail2> ...

    else if 
}