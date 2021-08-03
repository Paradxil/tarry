const InvoiceDAO = require("../data/invoiceDAO");
const puppeteer = require('puppeteer');

class GenerateInvoicePDFService {
    async generatePDF(invoiceid, userid) {
        let invoiceDAO = new InvoiceDAO();

        let invoice = await invoiceDAO.get(invoiceid);

        //Make sure the invoice exists and belongs to the current user.
        if(invoice == null || invoice.userid.toString() !== userid.toString()) {
            throw new Error("Error generating PDF of invoice");
        }

        console.log('http://192.168.68.104:3000/invoice/?id=' + invoiceid);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('http://192.168.68.106:3000/invoice/?id='+invoiceid, { waitUntil: 'networkidle0' });
        await page.addStyleTag({ content: 'body { background-color: white !important;}' });
        const pdf = await page.pdf({ format: 'Letter' });

        await browser.close();
        return pdf
    }
}

module.exports = GenerateInvoicePDFService;