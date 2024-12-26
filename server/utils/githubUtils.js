const path = require('path');
const process = require('process');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Create a new repository on GitHub with Markdown-formatted results.
 * 
 * @param {String} name Name of the repository to create.
 * @param {Boolean} isPrivate Whether the repository should be public or private.
 * @returns {String} Result message in Markdown indicating success or failure.
 */
async function createGithubRepo(name, isPrivate = true) {
    const url = `https://api.github.com/user/repos`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                private: isPrivate,
            }),
        });

        const data = await response.json();

        if (response.status !== 201) {
            return `- **Error**: ${data.message}`;
        } else {
            return `- **Repository Created Successfully**: [${data.name}](${data.html_url})`;
        }

    } catch (error) {
        return `- **Error**: ${error.message}`;
    }
}

/**
 * List repositories in the user's GitHub account with Markdown formatting.
 * 
 * @returns {string} Formatted list of repositories or an error message.
 */
async function listGithubRepos() {
    const url = `https://api.github.com/user/repos`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return `- **Error**: ${data.message}`;
        } else {
            return data.map((repo, index) => `**${index + 1}. [${repo.full_name}](${repo.html_url})**`).join("\n");
        }
    } catch (error) {
        return `- **Error**: ${error.message}`;
    }
}

module.exports = {
    createGithubRepo,
    listGithubRepos,
};
