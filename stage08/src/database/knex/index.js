const config = require("../../connection/knexfile.js");
const knex = require("knex");

const connection = knex(config.development);

module.exports = connection;