const mongoose = require('mongoose');

const scrapModel = new mongoose.Schema({
    image: String,
    title: String,
    rating: String,
    price: String,
    finalprice: String
});

const scrapType1 = mongoose.model('Flipkart', scrapModel, 'flipkart');
const scrapType2 = mongoose.model('Amazon', scrapModel, 'amazon');
const scrapType3 = mongoose.model('Snapdeal', scrapModel, 'snapdeal')

module.exports = {scrapType1, scrapType2, scrapType3}