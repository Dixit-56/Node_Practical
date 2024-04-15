const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE,
});
// connect to the MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");

  // create the users table if it doesn't exist
  connection.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255) DEFAULT NULL
    )
  `,
    (error) => {
      if (error) {
        console.error("Error creating users table:", error);
      } else {
        console.log("Users table created successfully");
      }
    }
  );
});
module.exports = connection;
