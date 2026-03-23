require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// Get Reviews from Database
app.get('/api/reviews', (req, res) => {
    db.query('SELECT * FROM reviews', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Save a New Review to Database
app.post('/api/reviews', (req, res) => {
    const { movie, review } = req.body;
    db.query('INSERT INTO reviews (movie_name, review_text) VALUES (?, ?)', [movie, review], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server running: http://localhost:3000'));