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
    // console.log("Connected as id " + connection.threadId);
    console.log("---------------------------");
 start();


});

function start () {
connection.query('SELECT * FROM Products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
    console.log(res[i].ItemId + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | PRICE: " + res[i].Price + " |  QTY: " + res[i].StockQuantity);
        }
        console.log("------------------------------");
    chooseItems();
});

}


function chooseItems() {
inquirer.prompt({
            name: "choice",
            type: "input",
            message: "Enter an Item ID: "
        }).then(function (answer) {
            var id = answer.choice;
            connection.query('SELECT * FROM Products WHERE ItemId=?', [id], function(err, res) {
           
            for (var i = 0; i < res.length; i++) {
                 var chosenItem = res[i].ItemId;
                 var chosenItemQty = res[i].StockQuantity;
                 var chosenItemPrice = res[i].Price;

    
                if (chosenItem == answer.choice) {
                        
                console.log("You chose: " + res[i].ItemId + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | PRICE: " + res[i].Price + " | QTY: " + res[i].StockQuantity);
                 inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many units?"
                }).then(function (answer) {
                    //how many units they want to purchase
                    var units = answer.quantity;
                    var total =  chosenItemPrice * units;       

                    if (chosenItemQty >= parseInt(units)) {
                        connection.query('UPDATE Products SET StockQuantity = ? - ? WHERE ItemId =?',[chosenItemQty, units, chosenItem], function(err, res) {

                            console.log("Order placed successfully! Your total is: $ " + total);

                            // start();
                            // chooseItems();
                            // add function here to add this to the cart
                        });
                    } else  {
                        console.log("Sorry, but we only have " + chosenItemQty + ". Please change your quantity.");
                        chooseItems();
                        // displayItems()();
                    }
                    // else {
                    //     console.log(units);
                    //     
                    //     console.log("it's not working");
                    // }
                });





} else {
    console.log("That iD doesn't exist");
    chooseItems();
}
}

});
});



}