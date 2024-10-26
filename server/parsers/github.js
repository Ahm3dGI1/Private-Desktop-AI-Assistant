const { createGithubRepo } = require('../utils/githubUtils.js');

/**
 * Handle the GitHub command.
 * 
 * @param {List} task Task object containing the command and parameters.
 */
async function githubCMDHandler(task){

    console.log(`Handling Github command: ${task}`);

    let result = "";

    // Handle Gmail labels listing
    if (task.startsWith("##[github-create-repo]")) {
        // Regex pattern to capture the parameters of the command since they can be more than one word and are wrapped in single quotes
        const regex = /'([^']+)'/g;
        const matches = [...task.matchAll(regex)].map(match => match[1]);
        
        const repoName = matches[0];
        const isPrivate = matches[1] === "private";

        result = await createGithubRepo(repoName, isPrivate);

        return result;
        
    }


};

