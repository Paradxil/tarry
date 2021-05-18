const mongoose = require('mongoose');

class Database {
    constructor() {
    }

    async connect() {
        // connect to the database.
        await mongoose.connect('mongodb://localhost:27017/timetracker', {
            useNewUrlParser: true,
            maxPoolSize: 25,
            useUnifiedTopology: true
        });
    }
}

//Singleton
module.exports = new Database();