const path = require('path');
const process = require('process');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Create a new repository on GitHub.
 * 
 * @param {String} name Name of the repository to create.
 * @param {Boolean} isPrivate Whether the repository should be public or private.
 * @returns {String} Result message indicating success or failure.
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
            return `Error creating repository: ${data.message}`;
        } else {
            return `Repository created successfully at: ${data.html_url}`;
        }

    } catch (error) {
        return `Failed to create repository: ${error.message}`;
    }
}

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
            return `Error listing repositories: ${data.message}`;
        } else {
            return data.map(repo => repo.full_name).join('\n');
        }
    } catch (error) {
        return `Failed to list repositories: ${error.message}`;
    }
}


module.exports = {
    createGithubRepo,
    listGithubRepos,
};