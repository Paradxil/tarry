const TimeEntryDAO = require("../data/timeEntryDAO");

class DeleteTimeEntryService {
    async deleteEntry(id) {
        let entryDAO = new TimeEntryDAO();
        await entryDAO.remove(id);
    }
}

module.exports = DeleteTimeEntryService;