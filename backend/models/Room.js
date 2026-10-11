const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' },
    amenities: [{ type: String }],
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
