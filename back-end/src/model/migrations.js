const TimeEntryDAO = require("../data/timeEntryDAO");
const TaskDAO = require("../data/taskDAO");
const UserDAO = require("../data/userDAO");
const TimeEntryModel = require("../model/timeEntry");
const config = require('../utils/config');
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const ProjectDAO = require("../data/projectDAO");
const Project = require("./project");
const Address = require("./address");
const Task = require("./task");

class Migrations {
    static MIGRATIONS = {
        // 1: async function (userid) {
        //     console.log("MIGRATE ADDRESS SCHEMA - ENCRYPT EXISTING DOCUMENTS");
        //     const tmpAddressSchema = new mongoose.Schema({
        //         userid: {type: String, required: true},
        //         name: String,
        //         organization: String,
        //         street: String,
        //         city: String,
        //         state: String,
        //         zip: String,
        //         phone: String,
        //         email: String
        //     });

        //     tmpAddressSchema.plugin(encrypt.migrations, { secret: config.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid'] });
        //     const TmpAddress = Address.compile(Address.modelName, tmpAddressSchema, Address.collection.name, Address.db, mongoose);
        //     TmpAddress.migrateToA(function(err){
        //         if (err){ throw err; }
        //         console.log('Migration successful');
        //     });

        //     let userDAO = new UserDAO();
        //     let user = await userDAO.getUserById(userid);
        //     user.schemaVersion = 2;
        //     await user.save();
        // },
        // 2: async function (userid) {
        //     console.log("MIGRATE PROJECT SCHEMA - ENCRYPT EXISTING DOCUMENTS");
        //     const tmpProjectSchema = new mongoose.Schema({
        //         name: {type: String, required: true},
        //         userid: {type: String, required: true},
        //         color: {type: String, required: true},
        //         wage: {type: Number, required: true}
        //     });

        //     tmpProjectSchema.plugin(encrypt.migrations, { secret: config.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid'] });
        //     const TmpProject = Project.compile(Project.modelName, tmpProjectSchema, Project.collection.name, Project.db, mongoose);
        //     TmpProject.migrateToA(function(err){
        //         if (err){ throw err; }
        //         console.log('Migration successful');
        //     });

        //     let userDAO = new UserDAO();
        //     let user = await userDAO.getUserById(userid);
        //     user.schemaVersion = 3;
        //     await user.save();
        // },
        // 4: async function (userid) {
        //     console.log("MIGRATE TASK SCHEMA - ENCRYPT EXISTING DOCUMENTS");
        //     const tmpTaskSchema = new mongoose.Schema({
        //         name: {type: String, required: true},
        //         userid: {type: String, required: true},
        //         status: {type: String, required: true, enum: ["untracked", "todo", "completed"], default: "untracked"},
        //         project: {        
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'Projects',
        //             autopopulate: true
        //         }
        //     });

        //     tmpTaskSchema.plugin(encrypt.migrations, {secret: process.env.SECRET, encryptedFields: ['name']});
        //     const TmpTask = Task.compile(Task.modelName, tmpTaskSchema, Task.collection.name, Task.db, mongoose);
        //     TmpTask.migrateToA(function(err){
        //         if (err){ throw err; }
        //         console.log('Migration successful');
        //     });

        //     // let taskDAO = new TaskDAO();
        //     // let tasks = await taskDAO.getAllTasks(userid);

        //     // let taskNum = 0;

        //     // for(let task of tasks) {
        //     //     try {
        //     //         task.decrypt(async (err) => {
        //     //             if(err) {
        //     //                 console.log(err);
        //     //                 return;
        //     //             }

        //     //             task.name = "TASK " + taskNum;
        //     //             taskNum += 1;
        //     //             await task.save();

        //     //         });
        //     //     }
        //     //     catch(err) {
        //     //         console.log(err);
        //     //     }
        //     // }

        //     let userDAO = new UserDAO();
        //     let user = await userDAO.getUserById(userid);
        //     user.schemaVersion = 5;
        //     await user.save();
        // }
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