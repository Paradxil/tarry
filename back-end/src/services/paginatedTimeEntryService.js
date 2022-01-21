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
     * in the form of a timestamp.
     * For example, requesting the last 5 days would return the first five days 
     * found with time entries, but each day could be a month apart.
     * @param {number} numDays Number of days to include
     * @param {number} lastTimestamp Will not include any TimeEntries before this timestamp.
     * @returns {PaginatedTimeEntryServiceReturn}
     */
    async getPaginatedTimeEntries() {
        let entries = [];
        let last = 0;

        

        return {
            entries: entries,
            last: last
        }
    }
}

module.exports = PaginatedTimeEntryService;