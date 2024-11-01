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
 * @returns {Promise<Array|Error>} - A promise that resolves to an array of news articles or an error.
 */
async function getNews(query, category) {
    try {
        // Fetch top headlines from the news API based on the query
        let response = await newsapi.v2.topHeadlines({
            q: query,
        });
        
        // Extract articles from the response
        const articles = response.articles;
        return articles;

    } catch (error) {
        return error;
    }
}

module.exports = {
    getNews,
};