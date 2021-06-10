const TaskDAO = require('../data/taskDAO');

class AddTaskService {
    async addTask(name, userid, projects) {
        let taskDAO = new TaskDAO();
        return await taskDAO.add(name, userid, projects);
    }
}

module.exports = AddTaskService;