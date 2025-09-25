// ================================================================
// src/controllers/appointmentController.js - Logique métier RDV
// ================================================================

const appointmentService = require('../services/appointmentService');
const { formatResponse } = require('../utils/response');

async function getAllAppointmentsController(req, res, next) {
    try {
        const appointments = await appointmentService.getAllAppointments();
        return formatResponse(res, 200, 'Liste des rendez-vous récupérée avec succès', appointments);
    } catch (error) {
        next(error);
    }
}

async function getAppointmentByIdController(req, res, next) {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        return formatResponse(res, 200, 'Rendez-vous récupéré avec succès', appointment);
    } catch (error) {
        next(error);
    }
}

async function createAppointmentController(req, res, next) {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        return formatResponse(res, 201, 'Rendez-vous créé avec succès', appointment);
    } catch (error) {
        next(error);
    }
}

async function updateAppointmentController(req, res, next) {
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
        return formatResponse(res, 200, 'Rendez-vous mis à jour avec succès', appointment);
    } catch (error) {
        next(error);
    }
}

async function deleteAppointmentController(req, res, next) {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        return formatResponse(res, 200, 'Rendez-vous supprimé avec succès');
    } catch (error) {
        next(error);
    }
}

async function getPatientAppointmentsController(req, res, next) {
    try {
        const appointments = await appointmentService.getPatientAppointments(req.params.patientId);
        return formatResponse(res, 200, 'Rendez-vous du patient récupérés avec succès', appointments);
    } catch (error) {
        next(error);
    }
}

async function getDoctorAppointmentsController(req, res, next) {
    try {
        const appointments = await appointmentService.getDoctorAppointments(req.params.doctorId);
        return formatResponse(res, 200, 'Rendez-vous du médecin récupérés avec succès', appointments);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllAppointments: getAllAppointmentsController,
    getAppointmentById: getAppointmentByIdController,
    createAppointment: createAppointmentController,
    updateAppointment: updateAppointmentController,
    deleteAppointment: deleteAppointmentController,
    getPatientAppointments: getPatientAppointmentsController,
    getDoctorAppointments: getDoctorAppointmentsController
};