require('dotenv').config();

const Server = require('./server/server');

let server = new Server();
server.start(process.env.PORT);