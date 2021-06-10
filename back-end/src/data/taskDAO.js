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

    async add(name, userid, projects=[]) {
        let task = new Task({
            name: name,
            userid: userid,
            projects: projects
        });
        await task.save();
        return task;
    }

    async update(id, name, userid, projects=[]) {
        let task = await this.getTask(id);
        task.name = name;
        task.userid = userid;
        task.projects = projects;
    }
}

module.exports = TaskDAO;