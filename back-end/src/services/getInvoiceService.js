const InvoiceDAO = require("../data/invoiceDAO");

class GetInvoiceService {
    async getInvoice(invoiceid) {
        let invoiceDAO = new InvoiceDAO();
        return await invoiceDAO.get(invoiceid);
    }
}

module.exports = GetInvoiceService;