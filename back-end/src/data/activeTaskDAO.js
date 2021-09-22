const ActiveTask = require('../model/activeTask');

class ActiveTaskDAO {
    /**
     * Get the active task for the current user.
     * @param {ID} userid The userid.
     * @returns The current active task for the given user.
     */
    async get(userid) {
        return await ActiveTask.findOne({userid: userid});
    }

    /**
     * Remove the users current active task.
     * @param {ID} userid 
     * @returns 
     */
    async remove(userid) { 
        return await ActiveTask.deleteOne({userid: userid});
    }

    /**
     * Add an active task for the current user. Each user can only 
     * have one active task at a time.
     * An active task is a task that is currently being tracked.
     * @param {String} taskid Id of the task.
     * @param {Id} userid 
     * @param {Number} start The start time for the task.
     * @returns 
     */
    async add(userid, taskid, start) {
        let task = new ActiveTask({
            taskid: taskid,
            userid: userid,
            start: start
        });

        try {
            await task.save();
        }
        catch(err) {
            return false;
        }

        return true;
    }
}

module.exports = ActiveTaskDAO;