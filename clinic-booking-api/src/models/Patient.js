// ================================================================
// src/models/Patient.js - Modèle Patient
// ================================================================

import { query as _query } from '../config/database';

class Patient {
    /**
     * Récupérer tous les patients
     * @returns {Promise<Array>} Liste des patients
     */
    static async findAll() {
        const query = 'SELECT * FROM patients WHERE is_active = TRUE';
        return _query(query);
    }

    /**
     * Récupérer un patient par son ID
     * @param {number} id - ID du patient
     * @returns {Promise<Object>} Données du patient
     */
    static async findById(id) {
        const query = 'SELECT * FROM patients WHERE patient_id = ?';
        const result = await _query(query, [id]);
        return result[0] || null;
    }

    /**
     * Créer un nouveau patient
     * @param {Object} patientData - Données du patient
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async create(patientData) {
        const query = `
            INSERT INTO patients 
            (first_name, last_name, email, phone, date_of_birth, gender, address, 
            emergency_contact_name, emergency_contact_phone, medical_history, allergies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            patientData.first_name,
            patientData.last_name,
            patientData.email,
            patientData.phone,
            patientData.date_of_birth,
            patientData.gender,
            patientData.address,
            patientData.emergency_contact_name,
            patientData.emergency_contact_phone,
            patientData.medical_history,
            patientData.allergies
        ];

        const result = await _query(query, params);
        return {
            id: result.insertId,
            ...patientData
        };
    }

    /**
     * Mettre à jour un patient
     * @param {number} id - ID du patient
     * @param {Object} patientData - Nouvelles données du patient
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async update(id, patientData) {
        const query = `
            UPDATE patients 
            SET first_name = ?, 
                last_name = ?, 
                email = ?, 
                phone = ?, 
                date_of_birth = ?, 
                gender = ?, 
                address = ?, 
                emergency_contact_name = ?, 
                emergency_contact_phone = ?, 
                medical_history = ?, 
                allergies = ?
            WHERE patient_id = ?
        `;
        
        const params = [
            patientData.first_name,
            patientData.last_name,
            patientData.email,
            patientData.phone,
            patientData.date_of_birth,
            patientData.gender,
            patientData.address,
            patientData.emergency_contact_name,
            patientData.emergency_contact_phone,
            patientData.medical_history,
            patientData.allergies,
            id
        ];

        const result = await _query(query, params);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un patient (désactivation logique)
     * @param {number} id - ID du patient
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async delete(id) {
        const query = 'UPDATE patients SET is_active = FALSE WHERE patient_id = ?';
        const result = await _query(query, [id]);
        return result.affectedRows > 0;
    }
}

export default Patient;