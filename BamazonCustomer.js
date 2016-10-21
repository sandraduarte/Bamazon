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
   console.log("Welcome to The Lash Shop!");
   console.log("Connected as id " + connection.threadId);
   console.log("---------------------------");

   // start();
});

//display all items
function display () {
	connection.query('SELECT * FROM products', function(err, res) {
       console.log(res);
});
}
display();
















// DISABLE CONNECTION TO MYSQL
connection.end();
