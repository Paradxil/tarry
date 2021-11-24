var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for users
const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userid: {type: String, required: true},
    color: {type: String, required: true},
    wage: {type: Number, required: true}
});

projectSchema.plugin(encrypt, {secret: process.env.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid']});

// Create a model for users
module.exports = mongoose.model('Projects', projectSchema);