const cheerio = require('cheerio');
const axios = require('axios').default;
const url = 'https://javtiful.com/user/theyoungman/playlist?page=$';

async function favoritePageSelector(pageNum){
	const { data } = await axios.get(url.replace('$',pageNum));
	return cheerio.load(data);
}

async function fakyutubSelector(url){
    return cheerio.load((await axios.get(url)).data);
}

async function javPageSelector(url){
    return cheerio.load((await axios.get(url)).data);
}

module.exports = { favoritePageSelector, fakyutubSelector, javPageSelector }