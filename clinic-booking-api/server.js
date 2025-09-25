const express = require('express');
const cors = require('cors');
const config = require('./src/config/environment');
const db = require('./src/config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test de la base de données au démarrage
db.testConnection();

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'Clinic Booking API is running!',
        version: '1.0.0',
        endpoints: [
            'GET /api/patients',
            'POST /api/patients',
            'GET /api/appointments',
            'POST /api/appointments'
        ]
    });
});

// Route de test pour les patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await db.query('SELECT * FROM patients LIMIT 10');
        res.json({
            success: true,
            data: patients,
            count: patients.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des patients',
            error: error.message
        });
    }
});

// Route de test pour créer un patient
app.post('/api/patients', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, date_of_birth, gender } = req.body;
        
        const result = await db.query(
            'INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, date_of_birth, gender]
        );
        
        res.status(201).json({
            success: true,
            message: 'Patient créé avec succès',
            data: {
                id: result.insertId,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du patient',
            error: error.message
        });
    }
});

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log('');
    console.log('🏥 ================================');
    console.log('   CLINIC BOOKING API STARTED');
    console.log('🏥 ================================');
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`📊 Health: http://localhost:${PORT}/`);
    console.log('================================');
    console.log('');
});