const ActiveTaskDAO = require('../data/activeTaskDAO');
const TaskDAO = require('../data/taskDAO');

class StartTaskService {
    async startTask(userid, name, start, project) {
        let taskDAO = new TaskDAO();
        let task = await taskDAO.add(name, userid, project);
        let taskid = task._id;

        if(taskid === null) {
            throw new Error("Error creating task.");
        }

        let dao = new ActiveTaskDAO();
        let success = await dao.add(userid, taskid, start, project);

        if(!success) {
            throw new Error("Error starting task.");
        }
    }
}

module.exports = StartTaskService;