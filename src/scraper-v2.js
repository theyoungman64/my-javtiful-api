const { favoritePageSelector, fakyutubSelector, javPageSelector, javSearchSelector } = require('./selector');
const { getActress } = require('./utils.js')
const { selector } = require('./field-selector.js');

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
    return items;
}

async function scrapFakyutub(fakyutubUrl) {
    const fakyutubePage = await fakyutubSelector(fakyutubUrl);
    let imgUrl = `https://fakyutube.com${fakyutubePage('#download-poster > img').first().attr('src')}`
    return { imgUrl }
}

async function scarpJavThumb(title) {
    let selector = await javSearchSelector(title);
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
    // console.log(url);
    const videoPage = await javPageSelector(url);
    // const codeRegex = require('./field-selector.js').selector['CODE_REGEX']; -- this doesn't work
    const codeRegex = /((\d|[A-Z])+-\d+|1Pondo (\d|_)+|Caribbeancom( |-)(\d|-)+|10Musume (\d|_)+|HEYZO-\d+|S-Cute-(\d|-|\w)+)|Heydouga (\d|-|\w)/y;
    let fakyutubUrl = videoPage('a.dropdown-item[rel="nofollow"][target="_blank"]').first().attr('href');
    let actress = getActress(videoPage);
    let title = videoPage('.box-video-title h1').attr('title');
    // console.log(title);
    let regexResult = codeRegex.exec(title);
    // console.log(/((\d|[A-Z])+-\d+|1Pondo (\d|_)+|Caribbeancom( |-)(\d|-)+|10Musume (\d|_)+|HEYZO-\d+)/y)
    // console.log(regexResult);

    try {
        let code = regexResult[0];
        // console.log(code);
        let imgUrl = await scarpJavThumb(code);

        return { fakyutubUrl, title, actress, url, imgUrl, code };
    } catch (error) {
        console.log('error regex');
        console.log(url);
        console.log(regexResult);
        console.log(title);
        console.log(fakyutubUrl);
        console.log(actress)
        return { fakyutubUrl, title, actress, url, imgUrl, code };
    }

}

module.exports = { scrapFakyutub, scrapFavoritePage, scrapJavPage }