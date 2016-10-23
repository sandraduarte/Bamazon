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
    console.log("---------------------------");
    //SHOW START MENU
    start();

});


//START MENU, select query type
function start() {
    inquirer.prompt({
        name: "selectQuery",
        type: "rawlist",
        message: "Select a query:",
        choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        switch (answer.selectQuery) {
            case "View Products For Sale":
                displayProducts();

                break;
            case "View Low Inventory":
                lowInv();
                break;
            case "Add to Inventory":
                addMore();
                break;
            case "Add New Product":
                addNew();
                break;

        }

    });
}
//END START MENU


//PRODUCTS FOR SALE FUNCTION

// Display products for sale

function displayProducts() {
    connection.query('SELECT * FROM Products', function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ItemId + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | PRICE: " + res[i].Price + " |  QTY: " + res[i].StockQuantity);
        }
        console.log("------------------------------");
        chooseItems();
    });

}


// Choose an Item id and select a Quantity to purchase
function chooseItems() {

    inquirer.prompt({
        name: "choice",
        type: "input",
        message: "Enter an Item ID: "
    }).then(function(answer) {
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
                            message: "How many units would you like to buy?"
                        }).then(function(answer) {
                            //how many units they want to purchase
                            var units = answer.quantity;
                            var total = chosenItemPrice * units;

                            if (chosenItemQty >= parseInt(units)) {
                                connection.query('UPDATE Products SET StockQuantity = ? - ? WHERE ItemId =?', [chosenItemQty, units, chosenItem], function(err, res) {
                                    console.log("------------------------------");
                                    console.log("Order placed successfully! Your total is: $ " + total);
                                    console.log("------------------------------");
                                    inquirer.prompt({
                                        name: "continue",
                                        type: "confirm",
                                        message: "Continue Shopping?"
                                    }).then(function(answer) {
                                        if (answer.continue === true) {
                                            displayProducts();
                                        } else {
                                            start();
                                        }
                                    });

                                });
                            } else {
                                console.log("Insufficient Quantity. We only have " +  chosenItemQty + ". Start over, please.");
                                chooseItems();
                            }
                        });
                    }
                }
            });
        }
    );
}
//END PRODUCTS FOR SALE FUNCTION

//BEGIN VIEW LOW INVENTORY
function lowInv() {
    connection.query('SELECT * FROM Products WHERE StockQuantity < 50', function(err, res) {
        console.log("Viewing products with quantities less than 50.");

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ItemId + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | PRICE: " + res[i].Price + " | QTY: " + res[i].StockQuantity);
        }
        console.log("------------------------------");

        inquirer.prompt({
            name: "continue",
            type: "confirm",
            message: "Add Inventory?"
        }).then(function(answer) {
            if (answer.continue === true) {
                addMore();
            } else {
                start();
            }
        });

    });
}

//END VIEW LOW INVENTORY

// ADD NEW PRODUCT

function addNew() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What is the product you would like to submit?"
    }, {
        name: "department",
        type: "input",
        message: "What department would you like to place your product?"
    }, {
        name: "price",
        type: "input",
        message: "How much does this product cost?",

    }, {
        name: "qty",
        type: 'input',
        message: 'Enter the quantity.'
    }]).then(function(answer) {
        connection.query("INSERT INTO Products SET ?", {
            ProductName: answer.item,
            DepartmentName: answer.department,
            Price: answer.price,
            StockQuantity: answer.qty
        }, function(err, res) {
            console.log("Your product was added successfully!");
            console.log("You added: " + answer.item + " | " + answer.price + " | " + answer.department + " | " + answer.qty);
            start();
        });
    });
}
//END ADD NEW product

//ADD ADDITIONAL INVENTORY

function addMore() {
    inquirer.prompt({
        name: "choice",
        type: "input",
        message: "Enter an Item ID: "
    }).then(function(answer) {
        var id = answer.choice;
        connection.query('SELECT * FROM Products WHERE ItemId=?', [id], function(err, res) {

            for (var i = 0; i < res.length; i++) {
                var chosenItem = res[i].ItemId;
                var chosenItemQty = res[i].StockQuantity;


                if (chosenItem == answer.choice) {

                    console.log("You chose: " + res[i].ItemId + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | PRICE: " + res[i].Price + " | QTY: " + res[i].StockQuantity);
                    inquirer.prompt({
                        name: "quantity",
                        type: "input",
                        message: "How many units would you like to add to " + res[i].ProductName + " ?"
                    }).then(function(answer) {
                        //how many units they want to add
                        var units = answer.quantity;
                        connection.query('UPDATE Products SET StockQuantity = ? + ? WHERE ItemId =?', [chosenItemQty, units, chosenItem], function(err, res) {
                                console.log("------------------------------");
                                console.log("Inventory updated! ");

                                console.log("------------------------------");
                                inquirer.prompt({
                                    name: 'continueAdd',
                                    type: 'confirm',
                                    message: 'Continue adding inventory?'
                                }).then(function(answer){
                                    if(answer.continueAdd === true){
                                    addMore();
                                    } else {
                                     start();
 
                                    }
                                });

                            });
                        

                    });

                }
            }

        });
    });

}
//END ADD ADDITIONAL INVENTORY

