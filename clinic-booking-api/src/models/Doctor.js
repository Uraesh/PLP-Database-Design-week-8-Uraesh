// ================================================================
// src/models/Doctor.js - Modèle Doctor
// ================================================================

const db = require('../config/database');

class Doctor {
    /**
     * Récupérer tous les médecins
     * @returns {Promise<Array>} Liste des médecins
     */
    static async findAll() {
        const query = `
            SELECT d.*, s.name as specialization_name 
            FROM doctors d
            JOIN specializations s ON d.specialization_id = s.specialization_id
            WHERE d.is_active = TRUE
        `;
        return db.query(query);
    }

    /**
     * Récupérer un médecin par son ID
     * @param {number} id - ID du médecin
     * @returns {Promise<Object>} Données du médecin
     */
    static async findById(id) {
        const query = `
            SELECT d.*, s.name as specialization_name 
            FROM doctors d
            JOIN specializations s ON d.specialization_id = s.specialization_id
            WHERE d.doctor_id = ? AND d.is_active = TRUE
        `;
        const result = await db.query(query, [id]);
        return result[0] || null;
    }

    /**
     * Créer un nouveau médecin
     * @param {Object} doctorData - Données du médecin
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async create(doctorData) {
        const query = `
            INSERT INTO doctors 
            (first_name, last_name, email, phone, license_number, specialization_id, years_experience)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            doctorData.first_name,
            doctorData.last_name,
            doctorData.email,
            doctorData.phone,
            doctorData.license_number,
            doctorData.specialization_id,
            doctorData.years_experience || 0
        ];

        const result = await db.query(query, params);
        return {
            id: result.insertId,
            ...doctorData
        };
    }

    /**
     * Mettre à jour un médecin
     * @param {number} id - ID du médecin
     * @param {Object} doctorData - Nouvelles données du médecin
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async update(id, doctorData) {
        const query = `
            UPDATE doctors 
            SET first_name = ?, 
                last_name = ?, 
                email = ?, 
                phone = ?, 
                license_number = ?, 
                specialization_id = ?, 
                years_experience = ?
            WHERE doctor_id = ?
        `;
        
        const params = [
            doctorData.first_name,
            doctorData.last_name,
            doctorData.email,
            doctorData.phone,
            doctorData.license_number,
            doctorData.specialization_id,
            doctorData.years_experience || 0,
            id
        ];

        const result = await db.query(query, params);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un médecin (désactivation logique)
     * @param {number} id - ID du médecin
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async delete(id) {
        const query = 'UPDATE doctors SET is_active = FALSE WHERE doctor_id = ?';
        const result = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Récupérer les médecins par spécialité
     * @param {number} specializationId - ID de la spécialité
     * @returns {Promise<Array>} Liste des médecins
     */
    static async findBySpecialization(specializationId) {
        const query = `
            SELECT d.*, s.name as specialization_name 
            FROM doctors d
            JOIN specializations s ON d.specialization_id = s.specialization_id
            WHERE d.specialization_id = ? AND d.is_active = TRUE
        `;
        return db.query(query, [specializationId]);
    }
}

module.exports = Doctor;