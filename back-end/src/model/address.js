const config = require('../utils/config');
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for addresses
const addressSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    name: String,
    organization: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String
});

addressSchema.plugin(encrypt, { secret: config.SECRET, excludeFromEncryption: ['userid'], additionalAuthenticatedFields: ['userid'] });

// Create a model for addresses
module.exports = mongoose.model('Address', addressSchema);