const TimeEntryDAO = require("../data/timeEntryDAO");
const TaskDAO = require("../data/taskDAO");
const UserDAO = require("../data/userDAO");

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