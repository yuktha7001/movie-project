require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Connection Pool (Fixes ECONNRESET and connection drops)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET ALL REVIEWS
app.get('/api/reviews', (req, res) => {
    db.query('SELECT * FROM reviews ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to fetch reviews" });
        }
        res.json(results);
    });
});

// POST NEW REVIEW (Updated for AJAX/Fetch - No Redirect)
app.post('/api/reviews', (req, res) => {
    const { movie, review } = req.body;
    
    if (!movie || !review) {
        return res.status(400).json({ error: "Missing movie name or review text" });
    }

    const sql = 'INSERT INTO reviews (movie_name, review_text) VALUES (?, ?)';
    db.query(sql, [movie, review], (err, result) => {
        if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ error: "Failed to save review" });
        }
        // Send JSON back so the frontend knows it's done without reloading the page
        res.json({ success: true, message: "Review posted successfully!" });
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Server is LIVE!`);
    console.log(`🏠 View Portfolio: http://localhost:${PORT}`);
});