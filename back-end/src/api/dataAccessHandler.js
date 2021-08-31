const Response = require("../model/response/response");

class DataAccessHandler {
    /**
     * Initialize the DataAccessHandler.
     * @param {DataAccessService} service The DataAccessService to use.
     */
    constructor(service) {
        this.service = service;
    }

    async getHandler(req, res) {
        let id = req.params.id||req.body.id||null;
        
        try {
            let data = await this.service.get(id);
            res.send(Response.Success(data));
        }
        catch(err) {
            res.send(Response.Error("Error retrieving the data from the database."));
        }
    }
}

module.exports = DataAccessHandler;