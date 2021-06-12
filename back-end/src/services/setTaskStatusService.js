const TaskDAO = require('../data/taskDAO');

class SetTaskStatusService {
    async setTaskStatus(taskid, userid, status) {
        let taskDAO = new TaskDAO();
        let task = await taskDAO.getTask(taskid);

        if(task.userid !== userid) {
            throw new Error("Userid does not match task's userid.");
        }

        task = await taskDAO.setStatus(taskid, status);
        return task;
    }
}

module.exports = SetTaskStatusService;