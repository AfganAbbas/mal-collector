const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeAnime(i) {
    const url = `https://myanimelist.net/anime/${i}`
    try {
        const product = { title: '', description: '', imageSrc: '', malUrl:url }
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        product.imageSrc = $('[itemprop="image"]').attr('data-src')
        product.title = $('.title-name').text()
        // There are some <br> tags maybe it would be necessary to bypass them
        product.description = $('[itemprop="description"]').text()
        product.malKey = i;
        return product;
    } catch (error) {
        console.log(`error: ${i} - ${url}`);
    }

}

module.exports = async function execScrap(i, insertDB) {
    const anime = await scrapeAnime(i)
    if (anime) {
        insertDB(anime)
    }
}

