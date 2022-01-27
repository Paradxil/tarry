var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

function getTime(val) {
    return val.getTime?val.getTime():new Date(val);
}

// Create a scheme for time entry
/**
 * @typedef {Object} TimeEntry
 * @property {string} userid
 * @property {Task|ID} task
 * @property {Date} start Milliseconds when the time entry started.
 * @property {Date} end Milliseconds when time entry ended. 
 */
const timeEntrySchema = new mongoose.Schema({
    userid: {type: String, required: true},
    task: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        autopopulate: {path: 'task', populate: { path: 'project' }}
    },
    start: {type: Date, required: true, transform: getTime},
    end: {type: Date, required: true, transform: getTime}
});

timeEntrySchema.index({ userid: 1, start: -1 });

timeEntrySchema.plugin(require('mongoose-autopopulate'));

//Check that start < end
timeEntrySchema.pre('validate', async function() {
    if(this.end < this.start) {
        throw new Error("Error, entry must end after it starts.");
    }
});

// Create a model for users
module.exports = mongoose.model('TimeEntry', timeEntrySchema);