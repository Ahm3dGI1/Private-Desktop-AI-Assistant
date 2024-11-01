const {getNews} = require('../utils/newsUtils');

/**
 * Handles different news commands.
 * Accepted commands include:
 * - `##[news-list] <query>`: Lists the top news headlines based on the query.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command.
 */
async function newsCMDHandler(task) {
    try {
        console.log(`Handling news command: ${task}`);

        // Extract the query and category from the task

        // Regex pattern to capture the parameters of the command since they can be more than one word and are wrapped in single quotes
        const regex = /'([^']+)'/g;
        const matches = [...task.matchAll(regex)].map(match => match[1]);
        
        const query = matches[0];
        const category = matches[1];

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