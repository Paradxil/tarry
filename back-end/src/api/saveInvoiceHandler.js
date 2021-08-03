const SaveInvoiceService = require("../services/saveInvoiceService");
const Response = require("../model/response/response");

class SaveInvoiceHandler {
    async handle(req, res) {
        let service = new SaveInvoiceService();
        let invoiceData = req.body.invoice;
        let invoiceID = req.body.id||null;

        try {
            let invoice = await service.saveInvoice(invoiceData, invoiceID);
            res.send(Response.Success(invoice));
        }
        catch(err) {
            res.send(Response.Error("Error saving invoice."));
        }
    }
}

module.exports = SaveInvoiceHandler;