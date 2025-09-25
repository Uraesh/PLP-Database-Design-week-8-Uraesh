// ================================================================
// src/routes/doctorRoutes.js - Routes API docteurs
// ================================================================

const { Router } = require('express');
const router = Router();
const { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, getDoctorsBySpecialization } = require('../controllers/doctorController');

// Routes pour les docteurs
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.get('/specialization/:specializationId', getDoctorsBySpecialization);

module.exports = router;