// ================================================================
// src/middleware/errorHandler.js - Gestion d'erreurs
// ================================================================

import { formatResponse } from '../utils/response';

/**
 * Middleware de gestion des erreurs centralisé
 */
export default (err, req, res, next) => {
    // Log de l'erreur pour le débogage
    console.error(`[ERROR] ${err.stack || err.message}`);

    // Déterminer le code d'état HTTP approprié
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Une erreur interne est survenue';

    // Gestion des erreurs spécifiques
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Un enregistrement avec ces données existe déjà';
    }

    // Formater et envoyer la réponse d'erreur
    return formatResponse(res, statusCode, message);
};