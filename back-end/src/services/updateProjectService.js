const ProjectDAO = require("../data/projectDAO");

class UpdateProjectService {
    async updateProject(projectid, userid, name, color, wage) {
        let projectDAO = new ProjectDAO();
        return await projectDAO.update(projectid, name, userid, color, wage);
    }
}

module.exports = UpdateProjectService;