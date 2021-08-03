const InvoiceDAO = require("../data/invoiceDAO");

class SaveInvoiceService {
    async saveInvoice(invoiceData, id=null) {
        let invoiceDAO = new InvoiceDAO();
        let invoice = null;

        try {
            if(id == null) {
                invoice = await invoiceDAO.add(invoiceData);
            }
            else {
                invoice = await invoiceDAO.update(id, invoiceData);
            }
        }
        catch(err) {
            console.log(err);
            throw new Error("Error adding invoice.");
        }

        return invoice;
    }
}

module.exports = SaveInvoiceService;