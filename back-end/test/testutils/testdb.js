// Used by encrypt plugin in multiple schemas.
process.env.SECRET = 'test secret';

const Task = require('../../src/model/task');
const Project = require('../../src/model/project');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

class TestDB {
    constructor() {
        this.mongod = null;
    }
    /**
     * Connect to the in-memory database.
     */
    async connect() {
        this.mongod = await MongoMemoryServer.create();
        const uri = this.mongod.getUri();

        const mongooseOpts = {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        };

        await mongoose.connect(uri, mongooseOpts);
    }

    /**
     * Drop database, close the connection and stop mongod.
     */
    async closeDatabase() {
        if(this.mongod == null) {
            throw new Error('Must call connect() first.')
        }

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();
    }

    /**
     * Remove all the data for all db collections.
     */
    async clearDatabase() {
        if(this.mongod == null) {
            throw new Error('Must call connect() first.')
        }

        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }

}

module.exports = new TestDB();