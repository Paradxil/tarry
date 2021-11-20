const TimeEntryDAO = require("../data/timeEntryDAO");
const TaskDAO = require("../data/taskDAO");
const UserDAO = require("../data/userDAO");
const TimeEntryModel = require("../model/timeEntry");
const config = require('../utils/config');
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const ProjectDAO = require("../data/projectDAO");
const Address = require("./address");

class Migrations {
    static MIGRATIONS = {
        1: async function (userid) {
            console.log("MIGRATE ADDRESS SCHEMA - ENCRYPT EXISTING DOCUMENTS");
            const tmpAddressSchema = new mongoose.Schema({
                userid: {type: String, required: true},
                name: String,
                organization: String,
                street: String,
                city: String,
                state: String,
                zip: String,
                phone: String,
                email: String
            });

            tmpAddressSchema.plugin(encrypt.migrations, { secret: config.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid'] });
            const TmpAddress = Address.compile(Address.modelName, tmpAddressSchema, Address.collection.name, Address.db, mongoose);
            TmpAddress.migrateToA(function(err){
                if (err){ throw err; }
                console.log('Migration successful');
            });

            let userDAO = new UserDAO();
            let user = await userDAO.getUserById(userid);
            user.schemaVersion = 2;
            await user.save();
        }
    }

    static ShouldMigrate(version) {
        if(version === null || version === undefined || version !== process.env.SCHEMA_VERSION) { 
            return true;
        }
        return false;
    }

    static HasMigration(version) {
        return (version in this.MIGRATIONS);
    }

    static async Migrate(userid, version) {
        if(version === null || version === undefined) {
            version = 0;
        }

        if(!this.ShouldMigrate(version) || !this.HasMigration(version)) {
            return;
        }

        await this.MIGRATIONS[version](userid);
    }
}

module.exports = Migrations;