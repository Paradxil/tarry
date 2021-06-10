const TimeEntryDAO = require('../data/timeEntryDAO');

class AllTimeEntriesService {
    async getAllEntries(userid) {
        let timeEntryDAO = new TimeEntryDAO();
        return await timeEntryDAO.getAll(userid);
    }
}

module.exports = AllTimeEntriesService;