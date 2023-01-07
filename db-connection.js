const db_config = require('./data/config').db;

const mysql         = require('mysql2');
const connection    = mysql.createPool(db_config).promise();



module.exports = connection;