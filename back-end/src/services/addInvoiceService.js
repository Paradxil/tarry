const InvoiceDAO = require("../data/invoiceDAO");

class AddInvoiceService {
    async addInvoice(invoiceData) {
        let invoiceDAO = new InvoiceDAO();
        let invoice = null;

        try {
            invoice = await invoiceDAO.add(invoiceData);
        }
        catch(err) {
            throw new Error("Error adding invoice.");
        }

        return invoice;
    }
}

module.exports = AddInvoiceService;