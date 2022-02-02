const mongoose = require('mongoose');

class Database {
    constructor() {
    }

    async connect() {
        // connect to the database.
        await mongoose.connect(process.env.DATABASE_URL||'mongodb://127.0.0.1:27017/tarry', {
            useNewUrlParser: true,
            maxPoolSize: 25,
            useUnifiedTopology: true
        });
    }
}

//Singleton
module.exports = new Database();