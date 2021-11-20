const config = require('../utils/config');
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for users
const activeTaskSchema = new mongoose.Schema({
    taskid: {type: String, required: true},
    userid: {type: String, required: true, unique: true},
    start: {type: Number, required: true}
});

activeTaskSchema.plugin(encrypt, {secret: config.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid']});

// Create a model for users
module.exports = mongoose.model('ActiveTasks', activeTaskSchema);