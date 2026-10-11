const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    reminderSettings: {
        startBeforeDays: { type: Number, default: 3 },
        daysBeforeDue: { type: [Number], default: [3, 2, 1] },
        schedule: [{
            day: { type: Number, required: true },
            alerts: { type: Number, default: 0 },
            ivrCalls: { type: Number, default: 0 }
        }],
        whatsappEnabled: { type: Boolean, default: true },
        ivrEnabled: { type: Boolean, default: false }
    },
    paymentSettings: {
        upiId: { type: String },
        bankDetails: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
