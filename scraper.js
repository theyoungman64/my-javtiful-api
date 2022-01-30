#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const progressbar = require('progress');
const fs = require('fs');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.DB_URL;
const Jav = require('./src/model/jav.js')

const { scrapFavoritePage, scrapJavPage } = require('./src/scraper-v2');
const { throtleRequest, countPages } = require('./src/utils');

/**
 * Scraping all JAV link on the favorite JAV
 * @returns {Promise}
 */
const scrapingFavoritePages = async ({ firstNPage }) => {
	let tableData = [];
	let startTime = new Date();
	try {
		await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

		let i = 1;
		let loop = true;

		while (loop && ((i <= firstNPage) || firstNPage)) {
			loop = false;
			console.log(`scraping page ${i}`)
			let pageUrlLink = await scrapFavoritePage(i);

			if (pageUrlLink) {
				let urlLink = pageUrlLink.map(item => item.link);

				let dbPageLink = await Jav.find({ 'javtiful.url': { $in: urlLink } }).exec();
				tableData.push(...pageUrlLink.filter(item => !dbPageLink.map(item => item.javtiful.url).includes(item.link)));
				loop = true;
				i++;
			}
		}

		return tableData;
	} catch (err) {
		console.error(err);
	} finally {
		let elapsed = (new Date() - startTime) / 1000;
		console.log(`\ntime elapsed : ${elapsed}`)
	}
}

const scrapingFavoriteJav = async (data) => {
	let fakyutubData = []
	let dataLength = data.length;
	let throtle = throtleRequest();
	let startTime = new Date();
	console.log(`jav count : ${data.length}`)
	bar = new progressbar('downloading :percent :current :throtling [:bar]', { incomplete: '.', total: dataLength, width: 50 });
	try {
		data.reverse();
		for (const item of data) {
			let isThrotling = await throtle();
			let javPage = await scrapJavPage(item.link)
			fakyutubData.push(javPage);

			await Jav.create({
				code: javPage.code,
				actress: javPage.actress,
				javtiful: {
					fakyutubUrl: javPage.fakyutubUrl,
					url: javPage.url,
					title: javPage.title,
					imgUrl: javPage.imgUrl
				}
			});
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
		await mongoose.disconnect();
	}
}

const arg = process.argv.slice(2)[0];

if (arg === '--get-favorite-jav-link') {

} else if (arg === 'update') {

} else if (arg === 'scrap') {
	scrapingFavoritePages({ firstNPage: Number(process.argv[3] || true) })
		.then(data => {
			return scrapingFavoriteJav(data);
		}).then(data => {
			let toFile = JSON.stringify(data);
			// fs.writeFileSync('public/javs.json', toFile);
		}).catch(err => {
			console.log(err.response);
		})
}

module.exports = { scrapingFavoritePages, scrapingFavoriteJav }
