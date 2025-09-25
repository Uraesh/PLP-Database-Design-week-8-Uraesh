// ================================================================
// src/services/patientService.js - Services métier patients
// ================================================================

const { findAll, findById, create, update, deletePatient } = require('../models/Patient').default;

/**
 * Service pour la gestion des patients
 */
class PatientService {
    /**
     * Récupérer tous les patients
     * @returns {Promise<Array>} Liste des patients
     */
    async getAllPatients() {
        return findAll();
    }

    /**
     * Récupérer un patient par son ID
     * @param {number} id - ID du patient
     * @returns {Promise<Object>} Données du patient
     */
    async getPatientById(id) {
        const patient = await findById(id);
        if (!patient) {
            throw new Error('Patient non trouvé');
        }
        return patient;
    }

    /**
     * Créer un nouveau patient
     * @param {Object} patientData - Données du patient
     * @returns {Promise<Object>} Patient créé
     */
    async createPatient(patientData) {
        // Validation des données
        this.validatePatientData(patientData);
        return create(patientData);
    }

    /**
     * Mettre à jour un patient
     * @param {number} id - ID du patient
     * @param {Object} patientData - Nouvelles données du patient
     * @returns {Promise<Object>} Patient mis à jour
     */
    async updatePatient(id, patientData) {
        // Vérifier si le patient existe
        await this.getPatientById(id);
        
        // Validation des données
        this.validatePatientData(patientData);
        
        // Mise à jour du patient
        const success = await update(id, patientData);
        if (!success) {
            throw new Error('Échec de la mise à jour du patient');
        }
        
        return this.getPatientById(id);
    }

    /**
     * Supprimer un patient
     * @param {number} id - ID du patient
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    async deletePatient(id) {
        // Vérifier si le patient existe
        await this.getPatientById(id);
        
        // Suppression du patient
        return deletePatient(id);
    }

    /**
     * Valider les données d'un patient
     * @param {Object} data - Données à valider
     * @throws {Error} Si les données sont invalides
     */
    validatePatientData(data) {
        // Vérifier les champs obligatoires
        const requiredFields = ['first_name', 'last_name', 'phone', 'date_of_birth', 'gender'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Le champ ${field} est obligatoire`);
            }
        }

        // Validation du format de l'email
        if (data.email && !this.isValidEmail(data.email)) {
            throw new Error('Format d\'email invalide');
        }

        // Validation de la date de naissance
        if (new Date(data.date_of_birth) > new Date()) {
            throw new Error('La date de naissance ne peut pas être dans le futur');
        }

        // Validation du genre
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(data.gender)) {
            throw new Error('Genre invalide. Valeurs acceptées: Male, Female, Other');
        }
    }

    /**
     * Valider un email
     * @param {string} email - Email à valider
     * @returns {boolean} Résultat de la validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new PatientService();
