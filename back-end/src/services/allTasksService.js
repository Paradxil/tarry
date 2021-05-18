const TaskDAO = require('../data/taskDAO');

class AllTasksService {
    async getAllTasks(userid) {
        let taskDAO = new TaskDAO();
        return await taskDAO.getAllTasks(userid);
    }
}

module.exports = AllTasksService;