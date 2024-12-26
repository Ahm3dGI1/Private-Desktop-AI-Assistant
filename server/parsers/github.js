const { createGithubRepo, listGithubRepos } = require('../utils/githubUtils.js');

/**
 * Handle the GitHub command.
 * 
 * @param {List} task Task object containing the command and parameters.
 */
async function githubCMDHandler(taskName, taskParams){
    let result = "";

    // Handle Github create repo command
    if (taskName === "github-create-repo") {
        
        const repoName = taskParams.repoName;
        const isPrivate = taskParams.isPrivate;

        result = await createGithubRepo(repoName, isPrivate);
    }

    // Handle Github list repos command
    if (taskName === "github-list-repos") {
        result = "List of repos";
        result += await listGithubRepos();
    }
    
    return result;
};

module.exports = { githubCMDHandler };

