const {getNews} = require('../utils/newsUtils');

/**
 * Handles different news commands.
 * Accepted commands include:
 * - `##[news-list] <query>`: Lists the top news headlines based on the query.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command.
 */
async function newsCMDHandler(taskName, taskParams) {
    try {
        const query = taskParams.query;
        const category = taskParams.category;

        // Fetch news based on the query
        const articles = await getNews(query, category);

        let result = "Top News Headlines:\n";
        for (let i = 0; i < articles.length; i++) {
            result += `${i + 1}. ${articles[i].title}\n`;
        }

        return result;
    } catch (error) {
        return `Failed to fetch news: ${error.message}`;
    }
}