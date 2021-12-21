const config = require('dotenv').config();

if(config.error) {
    throw config.error;
}

module.exports = config.parsed;