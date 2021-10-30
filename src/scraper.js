const { favoritePageSelector, fakyutubSelector, javPageSelector } = require('./selector');
const { getActress } = require('./utils.js')

async function scrapFavoritePage(pageNum) {
    let items = [];

    const sel = await favoritePageSelector(pageNum);

    sel('.video-thumbnail > a[href^="https://javtiful.com/video"]').each((j, elem) => {
        let rowData = {
            page: pageNum,
            link: elem.attribs.href,
        }
        items.push(rowData);
    })
    console.log(`page ${pageNum} processed`);
    return items;
}

async function scrapFakyutub(fakyutubUrl) {
    const fakyutubePage = await fakyutubSelector(fakyutubUrl);
    let imgUrl = `https://fakyutube.com${fakyutubePage('#download-poster > img').first().attr('src')}`
    return { imgUrl }
}

/**
 * Function for scraping single javtiful video
 * 
 * @async
 * @param {String} url - url of single JAV on javtiful.com
 * @returns {Object} object of fakyutube URL, JAV title, actress JAV url and image URL
 * @description function for scraping single javtiful video
 */
async function scrapJav(url) {
    const videoPage = await javPageSelector(url);
    let fakyutubUrl = videoPage('a.dropdown-item[rel="nofollow"][target="_blank"]').first().attr('href');
    let imgUrl = (await scrapFakyutub(fakyutubUrl)).imgUrl
    // let actress = videoPage('.row.mb-3:nth-child(4) .info-data a').map((j, elem) => elem.attribs.title).toArray();
    let actress = getActress(videoPage);
    let title = videoPage('.box-video-title h1.vid_hd').text();
    return { fakyutubUrl, title, actress, url, imgUrl };
}

module.exports = { scrapFakyutub, scrapFavoritePage, scrapJav }