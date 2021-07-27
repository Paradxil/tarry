const Project = require('../model/project');

class ProjectDAO {
    async get(id) {
        return await Project.findOne({_id: id});
    }

    async remove(id) {
        return await Project.deleteOne({_id: id});
    }

    async getAll(userid) {
        return await Project.find({userid: userid});
    }

    async add(name, userid, color, wage) {
        let project = new Project({
            name: name,
            userid: userid,
            color: color,
            wage: wage
        });
        await project.save();
        return project;
    }

    async update(id, name, userid, color, wage) {
        let project = await this.get(id);
        project.name = name;
        project.userid = userid;
        project.color = color;
        project.wage = wage;
        await project.save();
    }
}

module.exports = ProjectDAO;