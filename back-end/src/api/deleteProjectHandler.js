const DeleteProjectService = require('../services/deleteProjectService');
const Response = require("../model/response/response");

class AddProjectHandler {
    async handle(req, res) {
        let service = new DeleteProjectService();

        let projectid = req.params.id;

        if(projectid === null) {
            res.send(Response.InvalidRequest("Invalid request."));
            return;
        }

        try {
            await service.deleteProject(projectid);
            res.send(Response.Success());
        }
        catch(err) {
            res.send(Response.Error("Error deleting project."));
        }
    }
}

module.exports = AddProjectHandler;