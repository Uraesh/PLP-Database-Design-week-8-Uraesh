// ================================================================
// src/config/environment.js - Configuration Variables d'Environnement
// ================================================================

const dotenv = require('dotenv');
const path = require('path');

// Charger le fichier .env
dotenv.config();

// Validation des variables requises
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.error('❌ Variables manquantes:', missingVars.join(', '));
    process.exit(1);
}

// Configuration
const config = {
    // Environnement
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',

    // Serveur
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost'
    },

    // Base de données
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME
    },

    // API
    api: {
        prefix: '/api',
        version: 'v1'
    }
};

// Affichage config en développement
if (config.isDevelopment) {
    console.log('🔧 Configuration:');
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Server: ${config.server.host}:${config.server.port}`);
    console.log(`   Database: ${config.database.user}@${config.database.host}/${config.database.name}`);
}

module.exports = config;