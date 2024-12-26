const NewsAPI = require('newsapi');
const process = require('process');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

/**
 * Fetches top news headlines based on a query and category.
 * 
 * @param {string} query - The search query for fetching news.
 * @param {string} category - The category of news to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of news articles.
 */
async function getNews(query, category) {
    try {
        // Fetch top headlines from the news API
        const response = await newsapi.v2.topHeadlines({
            q: query,
            category: category !== "general" ? category : undefined,
            language: 'en',
        });

        // Return the articles
        return response.articles || [];
    } catch (error) {
        console.error(`Error fetching news: ${error.message}`);
        return [];
    }
}

module.exports = {
    getNews,
};