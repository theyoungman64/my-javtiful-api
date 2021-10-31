const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://javtiful.com/user/theyoungman/playlist?page=$';
const THROTLE_TIME = 1;
const THROTLE_COUNT_TRIGGER = 10;

async function getFakyutubPlayer(vidId) {
	const { data } = await axios.post(`https://fakyutube.com/api/source/${vidId}`);
	return data.data;
}

async function countPages() {
	const { data } = await axios.get(url.replace('$', 1));
	const sel = cheerio.load(data);

	let itemsCount = parseInt(sel('.content-header-title > h1').text().replace(/\D+/g, ''));
	let page = (itemsCount % 12 === 0) ? (itemsCount / 12) : (((itemsCount - (itemsCount % 12)) / 12) + 1);
	return page;
}

/**\
 * 
 */
function throtleRequest() {
	//TODO: make parameter counter & timeout
	let counter = 0;

	return function () {
		if (counter >= THROTLE_COUNT_TRIGGER) {
			counter = 0;
			return new Promise((resolve) => {
				setTimeout(() => resolve(false), THROTLE_TIME);
			})
		} else {
			counter++;
			return new Promise((resolve) => {
				resolve(counter < THROTLE_COUNT_TRIGGER);
			})
		}
	}

}

//videoPage
function getActress(videoPage) {
	let result = videoPage('.row.mb-3 .info-title');
	let mapResult = result.map((index, item) => ({ title: item.children[0].data.toLowerCase(), index })).toArray();
	let index = mapResult.find(item => { return item.title === 'aktris' || item.title === 'actress' || item.title === 'actresses' })

	let resultActress = videoPage(`.row.mb-3:nth-child(${index.index + 1}) .info-data a`).map((j, elem) => elem.attribs.title).toArray();
	return resultActress;
}

module.exports = { throtleRequest, getFakyutubPlayer, countPages, getActress }
