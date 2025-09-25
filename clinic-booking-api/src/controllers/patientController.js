// ================================================================
// src/controllers/patientController.js - Logique métier patients
// ================================================================

const patientService = require('../services/patientService');
const { formatResponse } = require('../utils/response');

async function getAllPatients(req, res, next) {
    try {
        const patients = await patientService.getAllPatients();
        return formatResponse(res, 200, 'Liste des patients récupérée avec succès', patients);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};



async function getPatientById(req, res, next) {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        return formatResponse(res, 200, 'Patient récupéré avec succès', patient);
    } catch (error) {
        next(error);
    }
}

async function createPatient(req, res, next) {
    try {
        const newPatient = await patientService.createPatient(req.body);
        return formatResponse(res, 201, 'Patient créé avec succès', newPatient);
    } catch (error) {
        next(error);
    }
}

async function updatePatient(req, res, next) {
    try {
        const updatedPatient = await patientService.updatePatient(req.params.id, req.body);
        return formatResponse(res, 200, 'Patient mis à jour avec succès', updatedPatient);
    } catch (error) {
        next(error);
    }
}

async function deletePatient(req, res, next) {
    try {
        await patientService.deletePatient(req.params.id);
        return formatResponse(res, 200, 'Patient supprimé avec succès');
    } catch (error) {
        next(error);
    }
}