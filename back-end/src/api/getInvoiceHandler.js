const GetInvoiceService = require("../services/getInvoiceService");
const Response = require("../model/response/response");

class GetInvoiceHandler {
    async handle(req, res) {
        let service = new GetInvoiceService();

        let invoiceid = req.params.id||null;

        if(invoiceid == null) {
            res.send(Response.Error("Invalid invoice id."));
        }

        try {
            let invoice = await service.getInvoice(invoiceid);
            res.send(Response.Success(invoice));
        }
        catch(err) {
            res.send(Response.Error("Error returning invoice."));
        }
    }
}

module.exports = GetInvoiceHandler;