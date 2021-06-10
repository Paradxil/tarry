const ActiveTaskDAO = require('../data/activeTaskDAO');
const TimeEntryDAO = require('../data/timeEntryDAO');

class StopTaskService {
    async stopTask(userid, end) {
        let activeDAO = new ActiveTaskDAO();
        let timeEntryDAO = new TimeEntryDAO();

        let task = await activeDAO.get(userid);
        await activeDAO.remove(userid);

        task = await timeEntryDAO.add(userid, task.taskid, task.start, end);
        return task;
    }
}

module.exports = StopTaskService;