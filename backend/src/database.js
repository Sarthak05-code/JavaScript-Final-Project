const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "service_monitor",
  port: 3306,
});

module.exports = pool;
