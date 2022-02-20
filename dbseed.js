import mysql from 'mysql';
import fs from "fs"

let rawpass =  fs.readFileSync('C:\\Users\\Emma\\Documents\\complitou\\routes\\passwords.json');
let passwords = JSON.parse(rawpass);

const connection = mysql.createConnection({
    host: "complitou.cpf4qofraygb.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: passwords["sqlpassword"],
    database: "complitou"
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed:' + err.stack)
        return;
    }
    console.log("Connected!");
});

// connection.query("CREATE DATABASE complitou", function (err, result) {
// if (err) throw err;
// console.log("Database created");
// });

//create or alter
// var sql = "ALTER TABLE complitou (id INT AUTO_INCREMENT UNIQUE PRIMARY KEY, targetName TEXT, targetEmail TEXT, message TEXT, senderID INT, validatedBool INT DEFAULT 0, viewedBool INT DEFAULT 0, viewdate TEXT)"
// connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
// });

//var sql = "CREATE TABLE senders (id INT AUTO_INCREMENT UNIQUE PRIMARY KEY, nSend INT DEFAULT 0, resetDate DATE DEFAULT (CURRENT_DATE))"
//var sql = "ALTER TABLE senders ADD email TEXT"

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});
connection.end()
