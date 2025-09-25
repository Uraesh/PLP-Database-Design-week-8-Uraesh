// ================================================================
// src/middleware/logger.js - Logging
// ================================================================

/**
 * Middleware de journalisation des requêtes
 */
export default (req, res, next) => {
    const start = Date.now();
    
    // Journaliser la requête entrante
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Capturer la fin de la requête pour calculer le temps de réponse
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};