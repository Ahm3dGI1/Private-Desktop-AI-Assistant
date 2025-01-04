const { createGithubRepo, listGithubRepos } = require('../utils/githubUtils.js');

/**
 * Creates a new GitHub repository.
 * 
 * @param {Object} taskParams - The parameters for creating a repository.
 * @param {string} taskParams.repoName - The name of the repository to be created.
 * @param {boolean} taskParams.isPrivate - The privacy status of the repository (true for private, false for public).
 * @returns {string} - The result of the command execution in Markdown format.
 */
async function githubRepoCreate(taskParams) {
    try {
        if (!taskParams?.repoName) {
            return `### Error\n\n- **Reason**: "repoName" parameter is required for the "github-create-repo" command.`;
        }

        // Create GitHub repository
        const createResult = await createGithubRepo(taskParams.repoName, taskParams.isPrivate);
        return `### Repository Creation Result\n\n${createResult}`;
    } catch (error) {
        console.error(`Error creating GitHub repository:`, error);
        return `### Error\n\n- **Message**: ${error.message}`;
    }
}

/**
 * Lists the user's GitHub repositories.
 * 
 * @param {Object} taskParams - The parameters for listing repositories.
 * @returns {string} - The list of repositories in Markdown format.
 */
async function githubRepoList(taskParams = None) {
    try {
        // List GitHub repositories
        const listResult = await listGithubRepos();
        return `### GitHub Repositories\n\n${listResult}`;
    } catch (error) {
        console.error(`Error listing GitHub repositories:`, error);
        return `### Error\n\n- **Message**: ${error.message}`;
    }
}

module.exports = { 
    githubRepoCreate,
    githubRepoList,
 };
