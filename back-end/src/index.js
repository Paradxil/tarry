const config = require('./utils/config');

const Server = require('./server/server');

let server = new Server();
server.start(config.PORT);