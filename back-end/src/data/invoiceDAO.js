const Invoice = require('../model/invoice');
const DAO = require('./DAO');

module.exports = DAO.create(Invoice);