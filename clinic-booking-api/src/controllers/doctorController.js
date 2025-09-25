// ================================================================
// src/controllers/doctorController.js - Logique métier docteurs
// ================================================================

const doctorService = require('../services/doctorService');
const { formatResponse } = require('../utils/response');

async function getAllDoctors(req, res, next) {
    try {
        const doctors = await doctorService.getAllDoctors();
        return formatResponse(res, 200, 'Liste des médecins récupérée avec succès', doctors);
    } catch (error) {
        next(error);
    }
}

async function getDoctorById(req, res, next) {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        return formatResponse(res, 200, 'Médecin récupéré avec succès', doctor);
    } catch (error) {
        next(error);
    }
}

async function createDoctor(req, res, next) {
    try {
        const newDoctor = await doctorService.createDoctor(req.body);
        return formatResponse(res, 201, 'Médecin créé avec succès', newDoctor);
    } catch (error) {
        next(error);
    }
}

async function updateDoctor(req, res, next) {
    try {
        const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
        return formatResponse(res, 200, 'Médecin mis à jour avec succès', updatedDoctor);
    } catch (error) {
        next(error);
    }
}

async function deleteDoctor(req, res, next) {
    try {
        await doctorService.deleteDoctor(req.params.id);
        return formatResponse(res, 200, 'Médecin supprimé avec succès');
    } catch (error) {
        next(error);
    }
}

async function getDoctorsBySpecialization(req, res, next) {
    try {
        const doctors = await doctorService.getDoctorsBySpecialization(req.params.specializationId);
        return formatResponse(res, 200, 'Médecins par spécialisation récupérés avec succès', doctors);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsBySpecialization
};