const AddInvoiceService = require("../services/addInvoiceService");
const Response = require("../model/response/response");

class AddInvoiceHandler {
    async handle(req, res) {
        let service = new AddInvoiceService();
        let invoiceData = req.body.invoice;

        try {
            let invoice = await service.addInvoice(invoiceData);
            res.send(Response.Success(invoice));
        }
        catch(err) {
            res.send(Response.Error("Error adding invoice."));
        }
    }
}

module.exports = AddInvoiceHandler;