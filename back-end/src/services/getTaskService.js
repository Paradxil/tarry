const TaskDAO = require('../data/taskDAO');

class GetTaskService {
    async getTask(userid, taskid) {
        let taskDAO = new TaskDAO();
        let task = taskDAO.getTask(taskid);

        if(task.userid === userid) {
            return task;
        }

        throw new Error("Error, task does not belong to user.");
    }
}

module.exports = GetTaskService;