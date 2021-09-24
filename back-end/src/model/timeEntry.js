var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

//TODO: Consider using population.

// Create a scheme for time entry
const timeEntrySchema = new mongoose.Schema({
    userid: {type: String, required: true},
    //taskid: {type: String},
    task: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        autopopulate: {path: 'task', populate: { path: 'project' }}
    },
    start: {type: Number, required: true},
    end: {type: Number, required: true}
});

timeEntrySchema.plugin(require('mongoose-autopopulate'));

timeEntrySchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: []});

//Check that start < end
timeEntrySchema.pre('validate', async function() {
    if(this.end <= this.start) {
        throw new Error("Error, entry must end after it starts.");
    }
});

// Create a model for users
module.exports = mongoose.model('TimeEntry', timeEntrySchema);