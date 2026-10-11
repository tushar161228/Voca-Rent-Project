const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rentId: {type: mongoose.Schema.Types.ObjectId,ref: "Rent"},
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['WhatsApp',"Maintenance", 'IVR', 'In-App'], default: 'Maintenance' },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
    isRead: { type: Boolean, default: false },
    readAt:{type:Date},
    deliveredAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
