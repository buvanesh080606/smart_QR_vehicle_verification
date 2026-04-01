import Vehicle from '../models/Vehicle.js';
import { extractTextFromImage, parseOCRText } from '../utils/ocrService.js';
import crypto from 'crypto';
import os from 'os';

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const calculateStatus = (vehicle) => {
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  const insExpiry = new Date(vehicle.insuranceExpiryDate);
  const pucExpiry = new Date(vehicle.pucExpiryDate);

  if (insExpiry < currentDate || pucExpiry < currentDate) {
    return 'RED'; // Expired / Invalid
  } else if (insExpiry <= thirtyDaysFromNow || pucExpiry <= thirtyDaysFromNow) {
    return 'ORANGE'; // Expiring soon within 30 days
  }
  return 'GREEN'; // All Valid
};

export const uploadDocuments = async (req, res) => {
  try {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No documents uploaded' });
    }

    const ocrResults = {};

    for (const [key, fileArray] of Object.entries(files)) {
      const file = fileArray[0];
      const text = await extractTextFromImage(file.path);
      const parsed = parseOCRText(text);

      ocrResults[key] = {
        text, 
        parsed: { ...parsed },
      };
    }

    const rcData = ocrResults.rc?.parsed || {};
    const insData = ocrResults.insurance?.parsed || {};
    const pucData = ocrResults.puc?.parsed || {};

    const baseVehicleNum = rcData.plate_number ? rcData.plate_number : `MH12AB${Math.floor(1000 + Math.random() * 9000)}`;

    const autoFilledForm = {
      rcVehicleNumber: baseVehicleNum,
      ownerName: rcData.owner_name || req.user.name,

      insurancePolicy: insData.policy_number || 'INS001',
      insuranceStartDate: insData.start_date || new Date().toISOString().split('T')[0],
      insuranceExpiryDate: insData.expiry_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      insuranceVehicleNumber: baseVehicleNum,

      pucNumber: pucData.puc_number || 'PUC001',
      pucExpiryDate: pucData.puc_expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      pucVehicleNumber: baseVehicleNum,

      rcImage: req.files['rc']?.[0]?.path?.replace(/\\/g, '/'),
      insuranceImage: req.files['insurance']?.[0]?.path?.replace(/\\/g, '/'),
      pucImage: req.files['puc']?.[0]?.path?.replace(/\\/g, '/'),
    };

    res.json({ message: 'Documents processed via OCR', data: autoFilledForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OCR processing failed', error: error.message });
  }
};

export const registerVehicle = async (req, res) => {
  const {
    rcVehicleNumber,
    ownerName,
    insuranceVehicleNumber,
    insurancePolicy,
    insuranceStartDate,
    insuranceExpiryDate,
    pucVehicleNumber,
    pucNumber,
    pucExpiryDate,
    rcImage,
    insuranceImage,
    pucImage
  } = req.body;

  const normRC = rcVehicleNumber?.replace(/\s/g, '').toUpperCase();
  const normIns = insuranceVehicleNumber?.replace(/\s/g, '').toUpperCase();
  const normPuc = pucVehicleNumber?.replace(/\s/g, '').toUpperCase();

  if (normRC !== normIns || normRC !== normPuc) {
    return res.status(400).json({
      message: 'Mismatch detected! Vehicle Numbers on Documents do not match.',
      details: { rc: normRC, insurance: normIns, puc: normPuc }
    });
  }

  const vehicleID = crypto.randomUUID();

  const vehicleData = {
    userId: req.user._id,
    vehicleID,
    vehicleNumber: normRC,
    ownerName,
    insurancePolicy,
    insuranceStartDate,
    insuranceExpiryDate,
    pucNumber,
    pucExpiryDate,
    rcImage,
    insuranceImage,
    pucImage
  };

  const status = calculateStatus(vehicleData);
  vehicleData.status = status;
  
  // Use FRONTEND_URL from environment for public accessible QR codes.
  // Fallback to local network IP instead of localhost so mobiles can access it
  if (!process.env.FRONTEND_URL) {
    console.warn(`WARNING: FRONTEND_URL NOT SET. QR codes will default to local IP (${getLocalIP()}) to support mobile devices on the same network.`);
  }
  const frontendUrl = process.env.FRONTEND_URL || `http://${getLocalIP()}:5173`;
  vehicleData.qrCodeURL = `${frontendUrl}/vehicle/${vehicleID}`;

  try {
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate Vehicle Registration detected: The vehicle number is already registered.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPublicVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ 
      $or: [{ vehicleID: req.params.id }, { vehicleNumber: req.params.id.toUpperCase() }] 
    }).populate('userId', 'name email');
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ 
      $or: [{ vehicleID: req.params.id }, { vehicleNumber: req.params.id.toUpperCase() }] 
    }).populate('userId', 'name email');
    if (vehicle) {
      if (req.user.role === 'owner' && vehicle.userId._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view this vehicle' });
      }
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ 
      $or: [{ vehicleID: req.params.id }, { vehicleNumber: req.params.id.toUpperCase() }] 
    });
    if (vehicle) {
      const currentStatus = calculateStatus(vehicle);
      if (currentStatus !== vehicle.status) {
        vehicle.status = currentStatus;
        await vehicle.save();
      }

      res.json({
        ...vehicle.toObject(),
        insurance: {
          policyNumber: vehicle.insurancePolicy,
          startDate: vehicle.insuranceStartDate,
          expiryDate: vehicle.insuranceExpiryDate,
          status: new Date(vehicle.insuranceExpiryDate) < new Date() ? 'Expired' : 'Valid'
        },
        puc: {
          number: vehicle.pucNumber,
          expiryDate: vehicle.pucExpiryDate,
          status: new Date(vehicle.pucExpiryDate) < new Date() ? 'Expired' : 'Valid'
        }
      });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
