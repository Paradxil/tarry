const Invoice = require('../model/invoice');

class InvoiceDAO {
    async get(id) {
        return await Invoice.findOne({ _id: id });
    }

    async getAll(userid) {
        return await Invoice.find({ userid: userid });
    }

    async add(data) {
        let invoice = new Invoice(data);
        await invoice.save();
        return invoice;
    }

    async update(id, data) {
        let invoice = await this.get(id);
        for(let key of Object.keys(data)) {
            if(key in invoice) {
                invoice[key] = data[key];
            }
        }
        await invoice.save();
        return invoice;
    }
}

module.exports = InvoiceDAO;