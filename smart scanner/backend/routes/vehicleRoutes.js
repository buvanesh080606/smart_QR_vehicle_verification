import express from 'express';
import { uploadDocuments, registerVehicle, getVehicle, verifyVehicle, getPublicVehicle, getUserVehicles } from '../controllers/vehicleController.js';
import { protect, policeOnly } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/uploadDocuments',
  protect,
  upload.fields([
    { name: 'rc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'puc', maxCount: 1 }
  ]),
  uploadDocuments
);

router.post('/registerVehicle', protect, registerVehicle);

// Getting all vehicles for the specific logged in user
router.get('/', protect, getUserVehicles);

// Getting public vehicle info (for anyone scanning the QR code)
router.get('/public/:id', getPublicVehicle);

// Getting vehicle info (for owner or police)
router.get('/:id', protect, getVehicle);

// Verification route strictly for Police
router.get('/verify/:id', protect, policeOnly, verifyVehicle);

export default router;
