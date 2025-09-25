// ================================================================
// src/services/appointmentService.js - Services métier rendez-vous
// ================================================================

const { findAll, findById, create, update, deleteAppointment, findByPatient, findByDoctor } = require('../models/Appointment');

class AppointmentService {
    async getAllAppointments() {
        return findAll();
    }

    async getAppointmentById(id) {
        const appointment = await findById(id);
        if (!appointment) {
            throw new Error('Rendez-vous non trouvé');
        }
        return appointment;
    }

    async createAppointment(appointmentData) {
        this.validateAppointmentData(appointmentData);
        return create(appointmentData);
    }

    async updateAppointment(id, appointmentData) {
        await this.getAppointmentById(id);
        this.validateAppointmentData(appointmentData);
        const success = await update(id, appointmentData);
        if (!success) {
            throw new Error('Échec de la mise à jour du rendez-vous');
        }
        return this.getAppointmentById(id);
    }

    async deleteAppointment(id) {
        await this.getAppointmentById(id);        
        return deleteAppointment(id);
    }

    async getPatientAppointments(patientId) {
        return findByPatient(patientId);
    }

    async getDoctorAppointments(doctorId) {
        return findByDoctor(doctorId);
    }

    validateAppointmentData(data) {
        const requiredFields = ['patient_id', 'doctor_id', 'appointment_date', 'appointment_time', 'status_id'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Le champ ${field} est obligatoire`);
            }
        }

        // Vérifier que la date est dans le futur
        const appointmentDate = new Date(`${data.appointment_date}T${data.appointment_time}`);
        if (appointmentDate < new Date()) {
            throw new Error('La date du rendez-vous doit être dans le futur');
        }
    }
}

module.exports = new AppointmentService();