const { javPageSelector } = require('./src/selector.js');

async function start() {
    const videoPage = await javPageSelector('https://javtiful.com/video/11618/caribbeancom-081721-001-my-sexual-harassment-boss-had-sex');
    let result = videoPage('.row.mb-3 .info-title');
    let mapResult = result.map((index, item) => ({ title: item.children[0].data.toLowerCase(), index })).toArray();
    let index = mapResult.find(item => { return item.title === 'aktris' || item.title === 'actress' })

    let resultActress = videoPage(`.row.mb-3:nth-child(${index.index + 1}) .info-data a`).map((j, elem) => elem.attribs.title).toArray();
    console.log(resultActress);
}

start();