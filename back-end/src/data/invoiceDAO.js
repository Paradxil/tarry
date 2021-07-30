const Invoice = require('../model/invoice');

class InvoiceDAO {
    async get(id) {
        return await Invoice.findOne({ _id: id });
    }

    async getAll(userid) {
        return await Invoice.findOne({ userid: userid });
    }

    async add(data) {
        let invoice = new Invoice(data);
        await invoice.save();
        return invoice;
    }
}

module.exports = InvoiceDAO;