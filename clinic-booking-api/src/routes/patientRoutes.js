// ================================================================
// src/routes/patientRoutes.js - Routes API patients
// ================================================================

import { Router } from 'express';
const router = Router();
import { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../controllers/patientController';

// Routes pour les patients
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;