const InvoiceDAO = require("../data/invoiceDAO");

class AllInvoiceService {
    async getAllInvoices(userid) {
        let invoiceDAO = new InvoiceDAO();
        return await invoiceDAO.getAll(userid);
    }
}

module.exports = AllInvoiceService;