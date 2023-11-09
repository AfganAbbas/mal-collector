const axios = require("axios");
const cheerio = require("cheerio");

const dataFields = [
    'japanese', 'english',
    'type', 'episodes',
    'status', 'aired',
    'premiered', 'producers',
    'licensors', 'studios',
    'source', 'genres',
    'themes', 'duration',
    'rating'
];

async function scrapeAnime(i) {
    const url = `https://myanimelist.net/anime/${i}`
    try {
        const product = { title: '', description: '', main_image_url: '', mal_url: url }
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        product.main_image_url = $('[itemprop="image"]').attr('data-src')
        product.title = $('.title-name').text()
        // There are some <br> tags maybe it would be necessary to bypass them
        product.description = $('[itemprop="description"]').text()
        $('.leftside').find('.spaceit_pad').each(function (index, element) {
            const key = $(element).find('.dark_text').text().slice(0, -1).toLowerCase();
            const value = $(element).clone()
                .children('span')
                .remove()
                .end()
                .text().trim();
            if (dataFields.includes(key)) {
                product[key] = value
            }
        });
        product.score = $('[itemprop="ratingValue"]').text()
        return product;
    } catch (error) {
        console.log(`error: ${i} - ${url}`);
    }

}

async function execScrap(i, insertDB) {
    const anime = await scrapeAnime(i)
    if (anime) {
        insertDB(anime)
    }
}

module.exports = { execScrap, scrapeAnime }

