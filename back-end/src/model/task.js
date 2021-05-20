var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for users
const taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userid: {type: String, required: true},
    start: {type: Number, required: true},
    end: {type: Number, required: true},
    projects: {type: [String], required: false}
});

taskSchema.plugin(encrypt, {secret: process.env.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid']});

// Create a model for users
module.exports = mongoose.model('Tasks', taskSchema);