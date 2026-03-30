import Vehicle from '../models/Vehicle.js';
import { extractTextFromImage, parseOCRText } from '../utils/ocrService.js';
import crypto from 'crypto';
import os from 'os';

const getLocalIP = () => {
  const nets = os.networkInterfaces();
  let selectedIP = 'localhost';

  // Priority list of common interface names for physical network cards
  const priorityMatch = ['wi-fi', 'ethernet', 'wlan', 'en0', 'eth0'];

  for (const name of Object.keys(nets)) {
    const isPriority = priorityMatch.some(p => name.toLowerCase().includes(p));
    
    for (const net of nets[name]) {
      // IPv4, not internal, and skip virtual interfaces from common software like WSL, VirtualBox, VMWare
      if (net.family === 'IPv4' && !net.internal) {
        const isVirtual = name.toLowerCase().includes('vbox') || 
                          name.toLowerCase().includes('virtual') || 
                          name.toLowerCase().includes('wsl');
        
        if (!isVirtual) {
          if (isPriority) return net.address; // Immediate return for physical cards
          selectedIP = net.address;
        }
      }
    }
  }
  return selectedIP;
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
      const parsed = parseOCRText(text, key.toUpperCase());

      ocrResults[key] = {
        text, 
        parsed: { ...parsed, type: key.toUpperCase() },
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const baseVehicleNum = ocrResults.rc?.parsed?.vehicleNumber && ocrResults.rc.parsed.vehicleNumber !== "XX00XX0000"
      ? ocrResults.rc.parsed.vehicleNumber
      : `MH12AB${randomSuffix}`;

    const autoFilledForm = {
      rcVehicleNumber: baseVehicleNum,
      ownerName: ocrResults.rc?.parsed?.ownerName && ocrResults.rc.parsed.ownerName !== "JOHN DOE" 
         ? ocrResults.rc.parsed.ownerName 
         : req.user.name,

      insurancePolicy: ocrResults.insurance?.parsed?.policyNumber || 'INS001',
      insuranceStartDate: ocrResults.insurance?.parsed?.insuranceStartDate || new Date().toISOString().split('T')[0],
      insuranceExpiryDate: ocrResults.insurance?.parsed?.insuranceExpiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      insuranceVehicleNumber: ocrResults.insurance?.parsed?.vehicleNumber || baseVehicleNum,

      pucNumber: ocrResults.puc?.parsed?.pucNumber || 'PUC001',
      pucExpiryDate: ocrResults.puc?.parsed?.pucExpiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      pucVehicleNumber: ocrResults.puc?.parsed?.vehicleNumber || baseVehicleNum,

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
  vehicleData.qrCodeURL = `http://${getLocalIP()}:5173/vehicle/${vehicleID}`;

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
