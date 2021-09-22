const GenerateInvoicePDFService = require("../services/generateInvoicePDFService");
const Response = require("../model/response/response");

class GenerateInvoicePDFHandler {
    async handle(req, res) {
        let service = new GenerateInvoicePDFService();

        let invoiceid = req.params.id;
        let userid = req.user._id;

        try {
            let pdf = await service.generatePDF(invoiceid, userid);
            res.contentType("application/pdf");
            res.send(pdf);
        }
        catch(err) {
            res.send(Response.Error("Error generating PDF."));
        }
    }
}

module.exports = GenerateInvoicePDFHandler;