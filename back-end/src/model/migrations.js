const TimeEntryDAO = require("../data/timeEntryDAO");
const TaskDAO = require("../data/taskDAO");
const UserDAO = require("../data/userDAO");
const TimeEntryModel = require("../model/timeEntry");
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

class Migrations {
    static MIGRATIONS = {
        0: async function(userid) {
            console.log("RUNNING MIGRATION 0");

            let timeEntryDAO = new TimeEntryDAO();

            let taskDAO = new TaskDAO();
            let tasks = await taskDAO.getAllTasks(userid);

            for(let task of tasks) {
                await timeEntryDAO.add(userid, task._id, task.start, task.end);
            }

            let userDAO = new UserDAO();
            let user = await userDAO.getUserById(userid);
            user.schemaVersion = 1;
            await user.save();
        },
        1: async function (userid) { //Remove encryption from timeEntries
            console.log("RUNNING MIGRATION 1");

            // new schema without plugins
            let tmpSchema = new mongoose.Schema({
                userid: { type: String, required: true },
                taskid: { type: String, required: true },
                start: { type: Number, required: true },
                end: { type: Number, required: true }
            });

            tmpSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['start', 'end']});
            let tmpModel = TimeEntryModel.compile(TimeEntryModel.modelName, tmpSchema, TimeEntryModel.collection.name, TimeEntryModel.db, mongoose);

            let timeEntryDAO = new TimeEntryDAO();
            let entries = await tmpModel.find({ userid: userid });
            for(let entry of entries) {
                let e = await timeEntryDAO.get(entry._id);
                console.log(entry);
                console.log(e);
                e.end = entry.end;
                e.start = entry.start;
                await e.save();
            }

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