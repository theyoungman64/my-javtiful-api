const { favoritePageSelector, fakyutubSelector, javPageSelector, javSearchSelector } = require('./selector');
const { getActress } = require('./utils.js')

/**
 * 
 * @param {*} pageNum 
 * @returns Object {page: Number, link: String}. False if the page is invalid
 */
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
    let currentActivePage = parseInt(sel('li.page-item.active span.page-link').html());
    return (currentActivePage === pageNum) ? items : false;
}

async function scrapFakyutub(fakyutubUrl) {
    const fakyutubePage = await fakyutubSelector(fakyutubUrl);
    let imgUrl = `https://fakyutube.com${fakyutubePage('#download-poster > img').first().attr('src')}`
    return { imgUrl }
}

async function scarpJavThumb(code) {
    let selector = await javSearchSelector(code);
    return selector('a.ezmn > img').first().attr('data-original')
}

/**
 * Function for scraping single javtiful video
 * 
 * @async
 * @param {String} url - url of single JAV on javtiful.com
 * @returns {Object} object of fakyutube URL, JAV title, actress JAV url and image URL
 * @description function for scraping single javtiful video
 */
async function scrapJavPage(url) {
    const videoPage = await javPageSelector(url);
    const codeRegex = require('./field-selector.js').selector.CODE_REGEX;
    let fakyutubUrl = videoPage('#dl_serverft').first().attr('href');
    let actress = getActress(videoPage);
    let title = videoPage('.box-video-title h1').attr('title');

    try {
        let code = codeRegex.exec(title)[0];
        let imgUrl = await scarpJavThumb(code);
        return { fakyutubUrl, title, actress, url, imgUrl, code };
    } catch (error) {
        console.log('error regex');
        console.log(url);
        console.log(title);
        console.log(fakyutubUrl);
        console.log(actress)
        return { fakyutubUrl, title, actress, url, imgUrl, code };
    }

}

module.exports = { scrapFakyutub, scrapFavoritePage, scrapJavPage }