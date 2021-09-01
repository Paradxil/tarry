var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for invoices
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


//TODO: Add field encryption.
//invoiceSchema.plugin(encrypt, { secret: process.env.SECRET, excludeFromEncryption: ['userid', 'template'], additionalAuthenticatedFields: ['userid', 'template'] });

// Create a model for invoices
module.exports = mongoose.model('Address', addressSchema);