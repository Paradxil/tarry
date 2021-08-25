const GetProjectService = require("../services/getProjectService");
const Response = require("../model/response/response");

class GetProjectHandler {
    async handle(req, res) {
        let service = new GetProjectService();

        let id = req.params.id;
        let project = null;

        try {
            project = await service.getProject(id);
            res.send(Response.Success(project));
        }
        catch(err) {
            res.send(Response.Error("Error getting project."));
        }
    }
}

module.exports = GetProjectHandler;