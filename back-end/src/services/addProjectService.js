const ProjectDAO = require('../data/projectDAO');

class AddProjectService {
    async addProject(name, userid, color, wage) {
        let projectDAO = new ProjectDAO();
        return await projectDAO.add(name, userid, color, wage);
    }
}

module.exports = AddProjectService;