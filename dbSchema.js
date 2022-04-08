const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dbName = 'Ecommerce-website-scraping'

const dbUrl = 'mongodb+srv://JagadeeshVadlamuri:fkHZCHe0s8FUDVnH@cluster0.pqvtj.mongodb.net/Ecommerce-website-scraping';

module.exports = {mongodb, MongoClient, dbName, dbUrl} 