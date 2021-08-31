const Response = require("../model/response/response");

class DataAccessHandler {
    /**
     * Initialize the DataAccessHandler.
     * @param {DataAccessService} service The DataAccessService to use.
     */
    constructor(service) {
        this.service = service;
    }

    async get(req, res) {
        let id = req.params.id||req.body.id||null;
        
        try {
            let data = await this.service.get(id);
            res.send(Response.Success(data));
        }
        catch(err) {
            res.send(Response.Error("Error retrieving the data from the database."));
        }
    }

    async all(req, res) {
        let userid = req.user._id;
        
        try {
            let data = await this.service.all(userid);
            res.send(Response.Success(data));
        }
        catch(err) {
            res.send(Response.Error("Error retrieving the data from the database."));
        }
    }

    async add(req, res) {
        let data = req.body;
        let userid = req.user._id;

        try {
            let document = await this.service.add(userid, data);
            res.send(Response.Success(document));
        }
        catch(err) {
            res.send(Response.Error("Error adding data to the database."));
        }
    }

    async update(req, res) {
        let data = req.body;
        let id = req.params.id||req.body.id||null;

        try {
            let document = await this.service.update(id, data);
            res.send(Response.Success(document));
        }
        catch(err) {
            res.send(Response.Error("Error updating the document."));
        }
    }

    async delete(req, res) {
        let id = req.params.id||req.body.id||null;
        
        try {
            let data = await this.service.remove(id);
            res.send(Response.Success(data));
        }
        catch(err) {
            res.send(Response.Error("Error removing the document from the database."));
        }
    }
    
}

module.exports = DataAccessHandler;