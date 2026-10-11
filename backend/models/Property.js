const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},                                               
    name: { type: String, required: true },
    address: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
