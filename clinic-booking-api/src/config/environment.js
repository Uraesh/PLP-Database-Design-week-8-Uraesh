const dotenv = require('dotenv');
dotenv.config();

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost'
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME
    }
};

if (config.nodeEnv === 'development') {
    console.log('🔧 Configuration:', {
        environment: config.nodeEnv,
        server: `${config.server.host}:${config.server.port}`,
        database: `${config.database.user}@${config.database.host}/${config.database.name}`
    });
}

module.exports = config;