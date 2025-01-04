const { getNews } = require('../utils/newsUtils');

/**
 * Handles news-related commands.
 * 
 * Accepted commands:
 * - `news-list`: Fetches the top news headlines based on a query and/or category.
 * 
 * @param {Object} taskParams - The parameters for the news command.
 * @param {string} [taskParams.query] - The search term for the news query (optional).
 * @param {string} [taskParams.category] - The category of news (e.g., "technology", "sports", etc., optional).
 * @returns {string} - The result of the command execution in Markdown format.
 */
async function newsListArticles(taskParams) {
    try {
        const { query = "general", category = "general" } = taskParams;

        // Fetch news based on the query and category
        const articles = await getNews(query, category);

        if (!articles || articles.length === 0) {
            return `### No News Found\n\n- No articles were found for query: **"${query}"** and category: **"${category}"**.`;
        }

        // Format the result in Markdown
        const result = [
            `### Top News Headlines\n`,
            `**Query:** "${query}"`,
            `**Category:** "${category}"`,
            ...articles.map(
                (article, index) => `**${index + 1}.** [${article.title}](${article.url})\n    - **Source:** ${article.source.name}\n    - **Description:** ${article.description || "No description available."}`
            ),
        ].join("\n\n");

        return result;
    } catch (error) {
        console.error(`Error in listing articles for command "${taskName}":`, error);
        return `### Error\n\n- Failed to fetch news: **${error.message}**.`;
    }
}

module.exports = { newsListArticles };