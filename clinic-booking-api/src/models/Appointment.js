// ================================================================
// src/models/Appointment.js - Modèle Appointment
// ================================================================

import Database from '../config/database';
const db = new Database();

class Appointment {
    /**
     * Récupérer tous les rendez-vous
     * @returns {Promise<Array>} Liste des rendez-vous
     */
    static async findAll() {
        const query = `
            SELECT a.*, 
                   p.first_name as patient_first_name, p.last_name as patient_last_name,
                   d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                   s.status_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            JOIN appointment_status s ON a.status_id = s.status_id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        return db.query(query);
    }

    /**
     * Récupérer un rendez-vous par son ID
     * @param {number} id - ID du rendez-vous
     * @returns {Promise<Object>} Données du rendez-vous
     */
    static async findById(id) {
        const query = `
            SELECT a.*, 
                   p.first_name as patient_first_name, p.last_name as patient_last_name,
                   d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                   s.status_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            JOIN appointment_status s ON a.status_id = s.status_id
            WHERE a.appointment_id = ?
        `;
        const result = await db.query(query, [id]);
        return result[0] || null;
    }

    /**
     * Créer un nouveau rendez-vous
     * @param {Object} appointmentData - Données du rendez-vous
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async create(appointmentData) {
        const query = `
            INSERT INTO appointments 
            (patient_id, doctor_id, appointment_date, appointment_time, 
             duration_minutes, status_id, reason_for_visit, total_fee)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            appointmentData.patient_id,
            appointmentData.doctor_id,
            appointmentData.appointment_date,
            appointmentData.appointment_time,
            appointmentData.duration_minutes || 30,
            appointmentData.status_id || 1, // Par défaut: Scheduled
            appointmentData.reason_for_visit,
            appointmentData.total_fee
        ];

        const result = await db.query(query, params);
        return {
            id: result.insertId,
            ...appointmentData
        };
    }

    /**
     * Mettre à jour un rendez-vous
     * @param {number} id - ID du rendez-vous
     * @param {Object} appointmentData - Nouvelles données du rendez-vous
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async update(id, appointmentData) {
        const query = `
            UPDATE appointments 
            SET patient_id = ?, 
                doctor_id = ?, 
                appointment_date = ?, 
                appointment_time = ?, 
                duration_minutes = ?, 
                status_id = ?, 
                reason_for_visit = ?,
                notes = ?,
                total_fee = ?
            WHERE appointment_id = ?
        `;
        
        const params = [
            appointmentData.patient_id,
            appointmentData.doctor_id,
            appointmentData.appointment_date,
            appointmentData.appointment_time,
            appointmentData.duration_minutes || 30,
            appointmentData.status_id,
            appointmentData.reason_for_visit,
            appointmentData.notes,
            appointmentData.total_fee,
            id
        ];

        const result = await db.query(query, params);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un rendez-vous (annulation)
     * @param {number} id - ID du rendez-vous
     * @returns {Promise<boolean>} Résultat de l'opération
     */
    static async delete(id) {
        // Mettre à jour le statut à "Cancelled" (3)
        const query = 'UPDATE appointments SET status_id = 3 WHERE appointment_id = ?';
        const result = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Récupérer les rendez-vous d'un patient
     * @param {number} patientId - ID du patient
     * @returns {Promise<Array>} Liste des rendez-vous
     */
    static async findByPatient(patientId) {
        const query = `
            SELECT a.*, 
                   d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                   s.status_name
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            JOIN appointment_status s ON a.status_id = s.status_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        return db.query(query, [patientId]);
    }

    /**
     * Récupérer les rendez-vous d'un médecin
     * @param {number} doctorId - ID du médecin
     * @returns {Promise<Array>} Liste des rendez-vous
     */
    static async findByDoctor(doctorId) {
        const query = `
            SELECT a.*, 
                   p.first_name as patient_first_name, p.last_name as patient_last_name,
                   s.status_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN appointment_status s ON a.status_id = s.status_id
            WHERE a.doctor_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        return db.query(query, [doctorId]);
    }
}

export default Appointment;