// models/maintenanceFlag.model.js
const mongoose = require('mongoose');

const MaintenanceFlagSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false, index: true }, 
    time:{type:Number}, //store as minutes only
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceFlag', MaintenanceFlagSchema);