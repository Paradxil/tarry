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

    async add(name, userid, start, end) {
        let task = new Task({
            name: name,
            userid: userid,
            start: start,
            end: end
        });
        await task.save();
        return task;
    }

    async update(id, name, userid, start, end) {
        let task = await this.getTask(id);
        task.name = name;
        task.userid = userid;
        task.start = start;
        task.end = end;
    }
}

module.exports = TaskDAO;