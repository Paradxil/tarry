const ActiveTaskDAO = require('../data/activeTaskDAO');
const TaskDAO = require('../data/taskDAO');

class GetActiveTaskService {
    async getTask(userid) {
        let dao = new ActiveTaskDAO();
        let taskDAO = new TaskDAO();

        let activeTask = await dao.get(userid);

        if(activeTask !== null && activeTask.taskid !== null) {
            let task = await taskDAO.getTask(activeTask.taskid);

            if(task!==null) {
                activeTask = activeTask.toJSON();
                activeTask.name = task.name;
                activeTask.status = task.status;
            }
        }

        return activeTask;
    }
}

module.exports = GetActiveTaskService;