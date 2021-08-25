const ProjectDAO = require("../data/projectDAO");

class GetProjectService {
    async getProject(id) {
        let projectDAO = new ProjectDAO();
        return await projectDAO.get(id);
    }
}

module.exports = GetProjectService;