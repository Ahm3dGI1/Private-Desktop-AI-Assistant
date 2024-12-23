async function getNewUrl(query) {
    const searchResults = await fetch(`https://searxng.herokuapp.com/search?q=${query}`);
    
}