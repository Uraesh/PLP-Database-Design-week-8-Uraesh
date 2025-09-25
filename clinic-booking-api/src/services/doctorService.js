// ================================================================
// src/services/doctorService.js - Services métier docteurs
// ================================================================

const { findAll, findById, create, update, deleteDoctor, findBySpecialization } = require('../models/Doctor');

/**
 * Service pour la gestion des médecins
 */
class DoctorService {
    async getAllDoctors() {
        return findAll();
    }

    async getDoctorById(id) {
        const doctor = await findById(id);
        if (!doctor) {
            throw new Error('Médecin non trouvé');
        }
        return doctor;
    }

    async createDoctor(doctorData) {
        this.validateDoctorData(doctorData);
        return create(doctorData);
    }

    async updateDoctor(id, doctorData) {
        await this.getDoctorById(id);
        this.validateDoctorData(doctorData);
        const success = await update(id, doctorData);
        if (!success) {
            throw new Error('Échec de la mise à jour du médecin');
        }
        return this.getDoctorById(id);
    }

    async deleteDoctor(id) {
        await this.getDoctorById(id);
        return deleteDoctor(id);
    }

    async getDoctorsBySpecialization(specializationId) {
        return findBySpecialization(specializationId);
    }

    validateDoctorData(data) {
        const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'license_number', 'specialization_id'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Le champ ${field} est obligatoire`);
            }
        }

        if (!this.isValidEmail(data.email)) {
            throw new Error('Format d\'email invalide');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new DoctorService();