var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a schema for tasks
const taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userid: {type: String, required: true},
    projects: {type: [String], required: false}
});

taskSchema.plugin(encrypt, {secret: process.env.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid']});

// Create a model for tasks
module.exports = mongoose.model('Tasks', taskSchema);