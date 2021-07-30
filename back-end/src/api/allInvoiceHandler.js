const AllInvoiceService = require("../services/allInvoiceService");
const Response = require("../model/response/response");

class AllInvoiceHandler {
    async handle(req, res) {
        let service = new AllInvoiceService();
        let userid = req.user._id;

        try {
            let invoices = await service.getAllInvoices(userid);
            res.send(Response.Success(invoices));
        }
        catch(err) {
            res.send(Response.Error("Error getting invoices for user."));
        }
    }
}

module.exports = AllInvoiceHandler;