const progressbar = require('progress');
const fs = require('fs');
const { scrapFavoritePage, scrapJav } = require('./src/scraper');
const { throtleRequest, countPages } = require('./src/utils');

/**
 * Scraping all JAV link on the favorite JAV
 * @returns {Promise}
 */
const scrapingFavoritePages = async () => {
	let tableData = [];
	let startTime = new Date();
	try {
		let page = await countPages();
		tableData.push(...await scrapFavoritePage(1));

		for (let i = 2; i <= page; i++) {
			tableData.push(...await scrapFavoritePage(i));
		}
		return tableData;
	} catch (err) {
		console.error(err);
	} finally {
		let elapsed = (new Date() - startTime) / 1000;
		console.log(`time elapsed : ${elapsed}`)
	}
}

const scrapingFavoriteJav = async (data) => {
	let fakyutubData = []
	let dataLength = data.length;
	let throtle = throtleRequest();
	let startTime = new Date();
	bar = new progressbar('downloading :percent :current :throtling [:bar]', { incomplete: '.', total: dataLength, width: 50 });
	try {
		for (const item of data) {
			let isThrotling = await throtle();
			fakyutubData.push(await scrapJav(item.link));
			let statusThrotling = !isThrotling ? "Throtling..." : "...";
			bar.tick({
				'throtling': statusThrotling
			});
		}
		return fakyutubData
	} catch (err) {
		console.error(err);
	} finally {
		let elapsed = (new Date() - startTime) / 1000;
		console.log(`time elapsed : ${elapsed}`)
	}
}

const arg = process.argv.slice(2)[0];

if (arg === '--get-favorite-jav-link') {
	scrapingFavoritePages().then(data => {
		let toFile = JSON.stringify(data);
		fs.writeFileSync('public/javtiful-link.json', toFile);
	}).catch(err => {
		console.log(err);
	});
} else if (arg === '--get-fakyutube-link') {
	let rawData = fs.readFileSync('public/javtiful-link.json');
	let list = JSON.parse(rawData);
	// console.log(list);
	scrapingFavoriteJav(list).then(data => {
		let toFile = JSON.stringify(data);
		fs.writeFileSync('fakyutub-link.json', toFile);
	});
} else if (arg === 'scrap') {
	scrapingFavoritePages()
		.then(data => {
			return scrapingFavoriteJav(data);
		}).then(data => {
			let toFile = JSON.stringify(data);
			fs.writeFileSync('public/javs.json', toFile);
		}).catch(err => {
			console.log(err.response);
		})
}
