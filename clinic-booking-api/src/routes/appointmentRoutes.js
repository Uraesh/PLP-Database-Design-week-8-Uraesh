// ================================================================
// src/routes/appointmentRoutes.js - Routes API RDV
// ================================================================

const { Router } = require('express');
const router = Router();
const { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getPatientAppointments, getDoctorAppointments } = require('../controllers/appointmentController');

// Routes pour les rendez-vous
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/patient/:patientId', getPatientAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);

module.exports = router;