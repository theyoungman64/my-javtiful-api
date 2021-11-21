#!/usr/bin/env node
require('dotenv').config();
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
const scrapingFavoritePages = async () => {
	let tableData = [];
	let startTime = new Date();
	try {
		let page = await countPages();
		let bar = new progressbar('Processing page :current', { total: page, width: 50 });
		await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

		for (let i = 1; i <= page; i++) {
			let pageUrlLink = await scrapFavoritePage(i);
			let urlLink = pageUrlLink.map(item => item.link);

			let dbPageLink = await Jav.find({ 'javtiful.url': { $in: urlLink } }).exec();
			tableData.push(...pageUrlLink.filter(item => !dbPageLink.map(item => item.javtiful.url).includes(item.link)));
			bar.tick();
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
		for (const item of data) {
			let isThrotling = await throtle();
			let javPage = await scrapJavPage(item.link)
			fakyutubData.push(javPage);

			await Jav.create({ code: javPage.code, actress: javPage.actress, javtiful: { fakyutubUrl: javPage.fakyutubUrl, url: javPage.url, title: javPage.title, imgUrl: javPage.imgUrl } });
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
	scrapingFavoritePages()
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