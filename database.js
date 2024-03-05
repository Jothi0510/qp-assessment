var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: 'groceries'
});
connection.connect((err => {
    if(err) throw err;
    console.log("MySQL Connected");
}));
 

exports.databaseConnection = connection;