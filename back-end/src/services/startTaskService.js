const ActiveTaskDAO = require('../data/activeTaskDAO');
const TaskDAO = require('../data/taskDAO');

class StartTaskService {
    async startTask(userid, name, start, projects) {
        let taskDAO = new TaskDAO();
        let task = await taskDAO.add(name, userid, projects);
        let taskid = task._id;

        if(taskid === null) {
            throw new Error("Error creating task.");
        }

        let dao = new ActiveTaskDAO();
        let success = await dao.add(userid, taskid, start, projects);

        if(!success) {
            throw new Error("Error starting task.");
        }
    }
}

module.exports = StartTaskService;