const FileCmdType = Object.freeze({
    CREATE : 'file:create',
    DELETE : 'file:delete',
    RENAME : 'file:rename',
    MOVE : 'file:move',
    COPY : 'file:copy',
    EDIT : 'file:edit'
});


export const fileCmdHandler = async (cmdType, details) => {
    switch(cmdType) {
        case FileCmdType.CREATE:
            return createFile(details);
        case FileCmdType.DELETE:
            return deleteFile(details);
        case FileCmdType.RENAME:
            return renameFile(details);
        case FileCmdType.MOVE:
            return moveFile(details);
        case FileCmdType.COPY:
            return copyFile(details);
        case FileCmdType.EDIT:
            return editFile(details);
        default:
            throw new Error(`Unknown file command type: ${cmdType}`);
    }
}

const createFile = async (details) => {
    console.log(`Creating file: ${details}`);
}

const deleteFile = async (details) => {
    console.log(`Deleting file: ${details}`);
}

const renameFile = async (details) => {
    console.log(`Renaming file: ${details}`);
}