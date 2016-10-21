var mysql = require('mysql');
var inquirer = require('inquirer');


//MYSQL SETTINGS
var connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root', 
   password: '', 
   database: 'Bamazon'
});


//CONNECT TO MYSQL
connection.connect(function(err) {
   if (err) throw err;
   console.log("connected as id " + connection.threadId);
   // start();
});





















// DISABLE CONNECTION TO MYSQL
connection.end();
