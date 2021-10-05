const DAO = require("../data/DAO");
const DataAccessService = require("../services/dataAccessService");
const DataAccessHandler = require("./dataAccessHandler");

const Address = require("../model/address");
const Invoice = require("../model/invoice");
const TimeEntry = require("../model/timeEntry");
const Project = require("../model/project");
const Task = require("../model/task");
const Setting = require("../model/setting");

const schemas = {"address": Address, "invoice": Invoice, "entry": TimeEntry, "project": Project, "task": Task, "setting": Setting};

class DataAccessHandlerFactory {
    /**
     * Create a DataAccessHandler for a given schema.
     * @param {String} _for One of ['address', 'invoice'].
     * @returns A DataAccessHandler.
     */
    static createHandler(_for) {
        let schema = schemas[_for]||null;
        
        if(schema === null) {
            throw new Error("Error creating DataAccessHandler for " + _for);
        }

        let dao = DAO.create(schema);
        let service = new DataAccessService(dao);
        return new DataAccessHandler(service);
    }
}

module.exports = DataAccessHandlerFactory;