// ================================================================
// src/utils/response.js - Formatage réponses API
// ================================================================

/**
 * Formate la réponse API de manière cohérente
 * @param {Object} res - Objet response d'Express
 * @param {Number} statusCode - Code HTTP de la réponse
 * @param {String} message - Message de la réponse
 * @param {Object|Array} data - Données à renvoyer (optionnel)
 * @returns {Object} Réponse formatée
 */
function formatResponse(res, statusCode, message, data = null) {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

module.exports = { formatResponse };