const { getNews } = require('../utils/newsUtils');

/**
 * Handles news-related commands.
 * 
 * Accepted commands:
 * - `news-list`: Fetches the top news headlines based on a query and/or category.
 * 
 * @param {string} taskName - The command to execute (e.g., "news-list").
 * @param {Object} taskParams - The parameters for the news command.
 * @param {string} [taskParams.query] - The search term for the news query (optional).
 * @param {string} [taskParams.category] - The category of news (e.g., "technology", "sports", etc., optional).
 * @returns {string} - The result of the command execution.
 */
async function newsCMDHandler(taskName, taskParams) {
    try {
        const { query = "general", category = "general" } = taskParams;

        // Fetch news based on the query and category
        const articles = await getNews(query, category);

        if (!articles || articles.length === 0) {
            return `No news articles found for query: "${query}" and category: "${category}".`;
        }

        // Format the result
        const result = [
            `Top News Headlines for query: "${query}" and category: "${category}":`,
            ...articles.map((article, index) => `${index + 1}. ${article.title}`),
        ].join("\n");

        return result;
    } catch (error) {
        console.error(`Error in newsCMDHandler for command "${taskName}":`, error);
        return `Failed to fetch news: ${error.message}`;
    }
}

module.exports = { newsCMDHandler };