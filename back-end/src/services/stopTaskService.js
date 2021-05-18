const ActiveTaskDAO = require('../data/activeTaskDAO');
const TaskDAO = require('../data/taskDAO');

class StopTaskService {
    async stopTask(userid, end) {
        let activeDAO = new ActiveTaskDAO();
        let taskDAO = new TaskDAO();

        let task = await activeDAO.get(userid);
        await activeDAO.remove(userid);

        task = await taskDAO.add(task.name, userid, task.start, end);
        return task;
    }
}

module.exports = StopTaskService;