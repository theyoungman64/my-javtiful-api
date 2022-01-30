const cheerio = require('cheerio');
const axios = require('axios').default;
const url = 'https://javtiful.com/user/theyoungman/playlist?page=$';
const urlSearch = 'https://javtiful.com/search/videos?search_query=$'

async function favoritePageSelector(pageNum) {
    const { data } = await axios.get(url.replace('$', pageNum));
    console.log(`scrap html page ${pageNum}`)
    return cheerio.load(data);
}

async function fakyutubSelector(url) {
    return cheerio.load((await axios.get(url)).data);
}

async function javPageSelector(url) {
    return cheerio.load((await axios.get(url)).data);
}

async function javSearchSelector(query) {
    return cheerio.load((await axios.get(urlSearch.replace('$', query))).data);
}

module.exports = { favoritePageSelector, fakyutubSelector, javPageSelector, javSearchSelector }