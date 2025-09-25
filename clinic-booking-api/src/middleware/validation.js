// ================================================================
// src/middleware/validation.js - Validation des données
// ================================================================

const { body, validationResult } = require('express-validator');
const { formatResponse } = require('../utils/response');

// Middleware pour vérifier les résultats de validation
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return formatResponse(res, 400, 'Erreur de validation des données', { errors: errors.array() });
    }
    next();
};

// Règles de validation pour les patients
const patientValidationRules = [
    body('first_name').notEmpty().withMessage('Le prénom est requis'),
    body('last_name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('phone').notEmpty().withMessage('Le téléphone est requis'),
    body('birth_date').isDate().withMessage('Date de naissance invalide'),
    validateRequest
];

// Règles de validation pour les médecins
const doctorValidationRules = [
    body('first_name').notEmpty().withMessage('Le prénom est requis'),
    body('last_name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('phone').notEmpty().withMessage('Le téléphone est requis'),
    body('license_number').notEmpty().withMessage('Le numéro de licence est requis'),
    body('specialization_id').isInt().withMessage('ID de spécialisation invalide'),
    validateRequest
];

// Règles de validation pour les rendez-vous
const appointmentValidationRules = [
    body('patient_id').isInt().withMessage('ID patient invalide'),
    body('doctor_id').isInt().withMessage('ID médecin invalide'),
    body('appointment_date').isDate().withMessage('Date invalide'),
    body('appointment_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format d\'heure invalide'),
    body('status_id').isInt().withMessage('ID statut invalide'),
    validateRequest
];

module.exports = {
    validateRequest,
    patientValidationRules,
    doctorValidationRules,
    appointmentValidationRules
};