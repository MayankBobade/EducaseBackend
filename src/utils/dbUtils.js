const { pool } = require("../config/db");

const createTable = async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS SCHOOL (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(40) NOT NULL,
                address VARCHAR(50) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL
            )`
        );
        console.log(" Table 'SCHOOL' created successfully");
    } catch (error) {
        console.error("Error creating table:", error.message);
    }
};

module.exports={createTable}