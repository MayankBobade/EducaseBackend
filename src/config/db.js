const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


const pool = mysql2.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('MYSQLHOST:', process.env.MYSQLHOST);
console.log('MYSQLUSER:', process.env.MYSQLUSER);
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '****' : 'EMPTY');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);
console.log('MYSQLPORT:', process.env.MYSQLPORT);


// Test the connection
const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(" Successfully connected to the database");
        connection.release();
    } catch (error) {
        console.error(" Could not connect to the database:", error.message);
    }
};

module.exports = { pool, checkConnection };
