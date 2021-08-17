var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for invoices
const invoiceSchema = new mongoose.Schema({
    id: String,
    userid: {type: String, required: true},
    start: {type: Number, required: true}, //Number of days to include in invoice. Ex: 7 would be an invoice for the last week.
    end: {type: Number, required: true},
    projects: {type: Array, required: true}, //Which projects to include in the invoice
    data: {type: Object, required: true}, //If not a template this field is required. Stores the report data for the invoice at time of creation. This way invoice data will not change even if old tasks are deleted etc.
    message: String,
    expenses: [{
        name: String,
        amount: Number
    }], //Stores additional costs or expenses to add to the invoice.
    billfrom: {
        name: String,
        company: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        contact: {
            phone: String,
            email: String
        }
    },
    billto: {
        name: String,
        company: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        contact: {
            phone: String,
            email: String
        }
    }
});


//TODO: Add field encryption.
//invoiceSchema.plugin(encrypt, { secret: process.env.SECRET, excludeFromEncryption: ['userid', 'template'], additionalAuthenticatedFields: ['userid', 'template'] });

// Create a model for invoices
module.exports = mongoose.model('Invoices', invoiceSchema);