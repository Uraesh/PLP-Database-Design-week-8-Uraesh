// ================================================================
// server.js - Point d'entrée principal
// ================================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet')// server.js
const express = require('express');

const json = require('body-parser').json;
const urlencoded = require('body-parser').urlencoded;

const cors = require('cors');
const config = require('./src/config/environment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Clinic Booking API is running!' });
});

// Route de test pour les patients
app.get('/api/patients', (req, res) => {
    res.json({ 
        message: 'Patients endpoint working',
        data: []
    });
});

// Démarrer le serveur
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
});
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import des routes
import patientRoutes from './src/routes/patientRoutes';
import doctorRoutes from './src/routes/doctorRoutes';
import appointmentRoutes from './src/routes/appointmentRoutes';

// Import des middlewares
import errorHandler from './src/middleware/errorHandler';
import logger from './src/middleware/logger';

// Initialisation de l'application Express
// Express app already declared above; no need to redeclare
// PORT is already declared above; remove this duplicate declaration

// Configuration des middlewares
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(json()); // Parsing JSON
app.use(urlencoded({ extended: true })); // Parsing URL-encoded
app.use(morgan('dev')); // Logging HTTP
app.use(logger); // Logging personnalisé

// Limiteur de taux pour prévenir les abus
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par IP
    message: 'Trop de requêtes, veuillez réessayer plus tard'
});
app.use(limiter);

// Routes API
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API de réservation de clinique',
        version: '1.0.0',
        endpoints: {
            patients: '/api/patients',
            doctors: '/api/doctors',
            appointments: '/api/appointments'
        }
    });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('Erreur non capturée:', err);
    process.exit(1);
});

module.exports = app; // Pour les tests
