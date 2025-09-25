// ================================================================
// src/config/database.js - Configuration MySQL avec Connection Pool
// ================================================================

const mysql = require('mysql2/promise');
const { database } = require('./environment');

// Configuration du pool de connexions
const poolConfig = {
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
    port: database.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4',
    timezone: '+00:00',
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: false,
    debug: false,
    multipleStatements: false,
    namedPlaceholders: true,
    rowsAsArray: false
};

// Création du pool de connexions
const pool = mysql.createPool(poolConfig);

class Database {
    constructor() {
        this.pool = pool;
    }

    /**
     * Exécuter une requête avec paramètres
     * @param {string} query - Requête SQL
     * @param {Array|Object} params - Paramètres de la requête
     * @returns {Promise<Array>} Résultats de la requête
     */
    async query(query, params = []) {
        try {
            const [rows] = await this.pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('❌ Database Query Error:', error.message);
            console.error('🔍 Query:', query);
            console.error('📊 Params:', params);
            throw error;
        }
    }

    /**
     * Exécuter une requête simple sans paramètres
     * @param {string} query - Requête SQL
     * @returns {Promise<Array>} Résultats de la requête
     */
    async simpleQuery(query) {
        try {
            const [rows] = await this.pool.query(query);
            return rows;
        } catch (error) {
            console.error('❌ Database Simple Query Error:', error.message);
            console.error('🔍 Query:', query);
            throw error;
        }
    }

    /**
     * Commencer une transaction
     * @returns {Promise<Connection>} Connexion pour la transaction
     */
    async beginTransaction() {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    /**
     * Valider une transaction
     * @param {Connection} connection - Connexion de la transaction
     */
    async commitTransaction(connection) {
        try {
            await connection.commit();
            connection.release();
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    /**
     * Annuler une transaction
     * @param {Connection} connection - Connexion de la transaction
     */
    async rollbackTransaction(connection) {
        try {
            await connection.rollback();
            connection.release();
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    /**
     * Vérifier la connexion à la base de données
     * @returns {Promise<boolean>} État de la connexion
     */
    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            console.log('✅ Database connection successful');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
    }

    /**
     * Obtenir des statistiques du pool de connexions
     * @returns {Object} Statistiques du pool
     */
    getPoolStats() {
        return {
            totalConnections: this.pool.pool._allConnections.length,
            freeConnections: this.pool.pool._freeConnections.length,
            usedConnections: this.pool.pool._allConnections.length - this.pool.pool._freeConnections.length,
            queuedRequests: this.pool.pool._connectionQueue.length
        };
    }

    /**
     * Fermer le pool de connexions (utile pour les tests)
     */
    async close() {
        try {
            await this.pool.end();
            console.log('📦 Database pool closed successfully');
        } catch (error) {
            console.error('❌ Error closing database pool:', error.message);
            throw error;
        }
    }

    /**
     * Méthode utilitaire pour formatter les conditions WHERE
     * @param {Object} conditions - Conditions sous forme d'objet
     * @returns {Object} Objet avec whereClause et values
     */
    buildWhereClause(conditions) {
        if (!conditions || Object.keys(conditions).length === 0) {
            return { whereClause: '', values: [] };
        }

        const clauses = [];
        const values = [];

        for (const [key, value] of Object.entries(conditions)) {
            if (value !== null && value !== undefined) {
                clauses.push(`${key} = ?`);
                values.push(value);
            }
        }

        const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
        
        return { whereClause, values };
    }

    /**
     * Méthode utilitaire pour les requêtes d'insertion
     * @param {string} table - Nom de la table
     * @param {Object} data - Données à insérer
     * @returns {Promise<Object>} Résultat de l'insertion
     */
    async insert(table, data) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        
        try {
            const result = await this.query(query, values);
            return {
                success: true,
                insertId: result.insertId,
                affectedRows: result.affectedRows
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Méthode utilitaire pour les requêtes de mise à jour
     * @param {string} table - Nom de la table
     * @param {Object} data - Données à mettre à jour
     * @param {Object} conditions - Conditions WHERE
     * @returns {Promise<Object>} Résultat de la mise à jour
     */
    async update(table, data, conditions) {
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const setValues = Object.values(data);
        
        const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
        
        if (!whereClause) {
            throw new Error('Update operation requires WHERE conditions');
        }

        const query = `UPDATE ${table} SET ${setClauses} ${whereClause}`;
        const allValues = [...setValues, ...whereValues];

        try {
            const result = await this.query(query, allValues);
            return {
                success: true,
                affectedRows: result.affectedRows,
                changedRows: result.changedRows
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Méthode utilitaire pour les requêtes de suppression
     * @param {string} table - Nom de la table
     * @param {Object} conditions - Conditions WHERE
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async delete(table, conditions) {
        const { whereClause, values } = this.buildWhereClause(conditions);
        
        if (!whereClause) {
            throw new Error('Delete operation requires WHERE conditions');
        }

        const query = `DELETE FROM ${table} ${whereClause}`;

        try {
            const result = await this.query(query, values);
            return {
                success: true,
                affectedRows: result.affectedRows
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Création de l'instance singleton
const db = new Database();

// Test de connexion au démarrage
db.testConnection().catch(error => {
    console.error('🔥 Critical: Cannot connect to database');
    process.exit(1);
});

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
    console.log('\n🔄 Closing database connections...');
    await db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Closing database connections...');
    await db.close();
    process.exit(0);
});

module.exports = db;