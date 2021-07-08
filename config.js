// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  private_key: process.env.PRIVATE_KEY,
  idInfura: process.env.IDINFURA
};