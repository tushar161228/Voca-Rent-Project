const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    fatherName: { type: String, },
    mobile: { type: String, required: true },
    aadhar: { type: String },
    email: { type: String },
    address: { type: String },
    joinDate:{type:Date},
    exitDate:{type:Date},

},{ timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);