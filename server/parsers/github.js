const { createGithubRepo, listGithubRepos } = require('../utils/githubUtils.js');

/**
 * Handles GitHub-related commands.
 * 
 * @param {string} taskName - The command to be executed (e.g., "github-create-repo", "github-list-repos").
 * @param {Object} taskParams - Parameters for the GitHub command.
 * @param {string} [taskParams.repoName] - The name of the repository to create (required for "github-create-repo").
 * @param {boolean} [taskParams.isPrivate] - Whether the repository is private (required for "github-create-repo").
 * @returns {string} - The result of the command execution.
 */
async function githubCMDHandler(taskName, taskParams) {
    try {
        switch (taskName) {
            case "github-create-repo":
                if (!taskParams?.repoName) {
                    return `### Error\n\n- **Reason**: "repoName" parameter is required for the "github-create-repo" command.`;
                }

                // Create GitHub repository
                const createResult = await createGithubRepo(taskParams.repoName, taskParams.isPrivate);
                return `### Repository Creation Result\n\n${createResult}`;

            case "github-list-repos":
                // List GitHub repositories
                const listResult = await listGithubRepos();
                return `### GitHub Repositories\n\n${listResult}`;

            default:
                return `### Error\n\n- **Reason**: Command "${taskName}" is not recognized.`;
        }
    } catch (error) {
        console.error(`Error handling GitHub command: ${taskName}`, error);
        return `### Error\n\n- **Command**: ${taskName}\n- **Message**: ${error.message}`;
    }
}

module.exports = { githubCMDHandler };
