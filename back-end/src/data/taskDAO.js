const Task = require('../model/task');

class TaskDAO {
    async getTask(id) {
        return await Task.findOne({_id: id});
    }

    async remove(id) {
        return await Task.deleteOne({_id: id});
    }

    async getAllTasks(userid) {
        return await Task.find({userid: userid});
    }

    async add(name, userid, project=null, status="untracked") {
        let task = new Task({
            name: name,
            userid: userid,
            project: project,
            status: status
        });

        try {
            await task.save();
        }
        catch(err) {
            if('taskid' in err) { //The task already exists
                return this.getTask(err.taskid);
            }
            else {
                throw new Error("Error adding task.");
            }
        }

        return task;
    }

    async update(id, name, userid, project) {
        let task = await this.getTask(id);
        task.name = name;
        task.userid = userid;
        task.project = project;

        try {
            await task.save();
        }
        catch(err) {
            if(err.taskid !== null) { //This task already exists.
                task = await Task.findOne({_id: err.taskid}); //Get the previously existing task.
            }
            else {
                throw err;
            }
        }

        return task;
    }

    async setStatus(id, status) {
        let task = await this.getTask(id);
        task.status = status;
        await task.save();
        return task;
    }
}

module.exports = TaskDAO;