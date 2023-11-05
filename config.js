const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
}