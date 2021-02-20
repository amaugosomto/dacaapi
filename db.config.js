'use strict';
const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
  host     : 'localhost',
  user     : 'dacagidj_panda',
  password : 'Daca@2021',
  database : 'dacagidj_apibricks'
});

// dbConn.connect(function(err) {
//   if (err) throw err;
//   console.log("Database Connected!");
// });

module.exports = dbConn;