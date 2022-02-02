const TimeEntryDAO = require('../data/timeEntryDAO');

/**
 * @typedef {Object} PaginatedTimeEntryServiceReturn
 * @property {import('../model/timeEntry').TimeEntry[]} entries
 * @property {number} last
 */

class PaginatedTimeEntryService {
    /**
     * Gets the last x days worth of entries.
     * Skips days with no entries, and allows setting an offset for pagination
     * in the form of a date.
     * For example, requesting the last 5 days would return the first five days 
     * found with time entries, but each day could be a month apart.
     * @param {number} numDays Number of days to include
     * @param {Date} lastTimestamp Will not include any TimeEntries before this timestamp.
     * @returns {PaginatedTimeEntryServiceReturn}
     */
    async getPaginatedTimeEntries(userid, numDays, lastTimestamp) {
        let entries = [];

        let last = null;

        if(lastTimestamp) {
            last = new Date(lastTimestamp);
        }

        let timeDAO = new TimeEntryDAO();
        entries = await timeDAO.getPaginated(userid, numDays, last);

        if(entries == null || entries.length === 0) {
            return {
                entries: entries,
                last: null,
                more: false
            }
        }

        let lastDay = entries[entries.length - 1];
        

        return {
            entries: entries,
            last: new Date(lastDay.entries[lastDay.entries.length - 1].start),
            more: true
        }
    }
}

module.exports = PaginatedTimeEntryService;