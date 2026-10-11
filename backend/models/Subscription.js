const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // currency: { type: String, default: 'INR' },
    durationDays: { type: Number, default: 30 },
    features: {
        whatsappAlerts: { type: Number, default: 0 },
        ivrCalls: { type: Number, default: 0 },
        maxTenants: { type: Number, default: 10 },
        messages:{type:String},
        // analytics: { type: Boolean, default: false }
    },
 
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Subscription', subscriptionSchema);
