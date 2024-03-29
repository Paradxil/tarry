const ActiveTaskDAO = require('../data/activeTaskDAO');
const TimeEntryDAO = require('../data/timeEntryDAO');

class StopTaskService {
    async stopTask(userid, end) {
        let activeDAO = new ActiveTaskDAO();
        let timeEntryDAO = new TimeEntryDAO();

        let activetask = await activeDAO.get(userid);
        await activeDAO.remove(userid);

        let entry = await timeEntryDAO.add(userid, activetask.taskid, activetask.start, end);
        
        return entry;
    }
}

module.exports = StopTaskService;