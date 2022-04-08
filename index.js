const express = require('express');
const router = express.Router();
const axios = require('axios');
const app = express();
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {scrapType1, scrapType2, scrapType3} = require('./scraping');
app.use(router);
app.use(bodyParser.json());
app.use(cors());
const {mongodb, MongoClient, dbName, dbUrl} = require('./dbSchema');
const { html } = require('cheerio/lib/api/manipulation');

const PORT = process.env.PORT || 8080;

const db = `${dbUrl}`;
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("Connection Success")
    }).catch(error=> console.log(error))

app.get('/', (req, res)=>{
    res.write("<h1><center>Welcome to the Webscrapper application</center><center><p>Please use '/flipkart' at the end of the above URL to get the flipkart data</p></center><center><p>Please use '/amazon' at the end of the above URL to get the amazon data</p></center><center><p>Please use '/snapdeal' at the end of the above URL to get the snapdeal data</p></center></h1>")
})

axios("https://www.flipkart.com/toys/puzzles-board-games/card-games/pr?sid=mgl,qet&otracker=nmenu_sub_Baby%20%26%20Kids_0_Board%20Games&otracker=nmenu_sub_Baby%20%26%20Kids_0_Board%20Games")
    .then(res=> {
        const htmlData = res.data
        const $ = cheerio.load(htmlData)
       
        let flipkart = [];
        
        $('._4ddWXP', htmlData).each((index, element)=>{
            const image = $(element).children('._2rpwqI').find('.CXW8mj').children('._396cs4').attr('src');
            const title = $(element).children('.s1Q9rs').text();
            const rating = $(element).children('._2D5lwg').children('._1lRcqv').children('._3LWZlK').text();
            const price = $(element).children('._8VNy32').children('._25b18c').children('._3I9_wc').text();
            const finalprice = $(element).children('._8VNy32').children('._25b18c').children('._30jeq3').text();
            
            flipkart.push({
                image,
                title,
                rating,
                price,
                finalprice
            }) 
        })
        app.route('/flipkart').get((req, res)=>{
            scrapType1.collection.insertMany(flipkart, (err, data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json(flipkart)
                }
            })
        })
    })

axios("https://www.amazon.in/s?bbn=1389402031&rh=n%3A976419031%2Cn%3A1389401031%2Cn%3A1389402031%2Cn%3A1389448031&dc&qid=1649294896&rnid=1389402031&ref=lp_1389402031_nr_n_19")
    .then(res=>{
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);

        var amazon = [];

        $('.a-spacing-medium', htmlData).each((index, element)=>{
            const image = $(element).children('.rush-component').children('.s-no-outline').children('.s-image-square-aspect').children('.s-image').attr('src');
            const title = $(element).children('.a-spacing-none').children('.a-spacing-top-small').find('.a-size-base-plus').text();
            const rating = $(element).children('.a-spacing-none').children('.a-spacing-top-micro').children('.a-size-small').find('.a-icon-alt').text();
            const finalprice = $(element).children('.a-spacing-none').children('.a-spacing-top-small').children('.a-color-base').find('.a-price-whole').text();
            const price = $(element).children('.a-spacing-none').children('.a-spacing-top-small').children('.a-color-base').find('.a-text-price').children('.a-offscreen').text();
            
            amazon.push({
                image,
                title,
                rating,
                finalprice,
                price
            })
        })
        app.route('/amazon').get((req, res)=>{
            scrapType2.collection.insertMany(amazon, (err, data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json(amazon)
                }
            })
        })
    })

axios("https://www.snapdeal.com/products/men-apparel-shirts?sort=plrty")
    .then(res=>{
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);

        var snapdeal = [];

        $('.dp-widget .product-tuple-listing', htmlData).each((index, element)=>{
            const image = $(element).find('picture img').attr('src');
            const title = $(element).children('.product-tuple-description').children('.product-desc-rating').children('.dp-widget-link').children('.product-title').text();
            const rating = $(element).children('.product-tuple-description').children('.product-desc-rating').find('.product-rating-count').text();
            const price = $(element).children('.product-tuple-description').children('.product-desc-rating').find('.product-desc-price').text();
            const finalprice = $(element).children('.product-tuple-description').children('.product-desc-rating').find('.product-price').text();
            
            snapdeal.push({
                image,
                title,
                rating,
                price,
                finalprice
            })
        })
        app.route('/snapdeal').get((req, res)=>{
            scrapType3.collection.insertMany(snapdeal, (err, data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json(snapdeal)
                }
            })
        })
    })

app.listen(PORT, ()=>{
    console.log("Server Up and Running", PORT)
})