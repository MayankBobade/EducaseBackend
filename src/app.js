const express = require('express');
const cors = require('cors');
const { pool, checkConnection } = require('./config/db');
const { createTable } = require('./utils/dbUtils');

const app = express();
app.use(cors());
app.use(express.json());

// Start server after DB connection and table creation
checkConnection().then(() => {
    try {
        app.listen(3000, async () => {
            console.log("Server Running on port 3000");
            await createTable();
        });
    } catch (error) {
        console.log("Could not connect to database:", error.message);
    }
});


app.post("/addSchool", async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: "Latitude and Longitude must be numbers." });
    }

    try {
        await pool.query(
            `INSERT INTO SCHOOL (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: "School added successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error while adding school." });
    }
});


app.get("/listSchools/:latitude/:longitude", async (req, res) => {
    const userLat = parseFloat(req.params.latitude);
    const userLong = parseFloat(req.params.longitude);

    if (isNaN(userLat) || isNaN(userLong)) {
        return res.status(400).json({ error: "Latitude and Longitude must be valid numbers." });
    }

    try {
        const [schools] = await pool.query(`SELECT * FROM SCHOOL`);

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Earth radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLong, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error while listing schools." });
    }
});
