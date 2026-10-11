const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    rentAmount: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    acceptedByTenant: { type: Boolean, default: false },
    acceptedAt: { type: Date },
    status: { type: String, enum: ['Pending', 'Active', 'Expired', 'Terminated'], default: 'Pending' },
    agreementUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lease', leaseSchema);
