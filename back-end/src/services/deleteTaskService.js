const TaskDAO = require('../data/taskDAO');

class DeleteTaskService {
    async deleteTask(taskid) {
        let taskDAO = new TaskDAO();
        await taskDAO.remove(taskid);
    }
}

module.exports = DeleteTaskService;