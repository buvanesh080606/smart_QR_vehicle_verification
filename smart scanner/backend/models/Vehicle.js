import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    vehicleID: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    insurancePolicy: {
      type: String,
      required: true,
    },
    insuranceStartDate: {
      type: Date,
      required: true,
    },
    insuranceExpiryDate: {
      type: Date,
      required: true,
    },
    pucNumber: {
      type: String,
      required: true,
    },
    pucExpiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['GREEN', 'ORANGE', 'RED'],
      default: 'GREEN',
    },
    qrCodeURL: {
      type: String,
    },
    rcImage: {
      type: String,
    },
    insuranceImage: {
      type: String,
    },
    pucImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
