const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true
});

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
