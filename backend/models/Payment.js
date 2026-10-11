const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
    },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    rentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rent' },
    amount: { type: Number, required: true },
    paidAmount: { type: Number },
    paymentMethod: { type: String, enum: ['Cash', 'Online', 'UPI', 'Bank Transfer'], default: 'Online' },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
    transactionId: { type: String },
    razorpayOrderId: {
        type: String,
        index: true,
    },

    type:{
        type: String,
        enum: ["subscription", "rent"],
        default: "rent",
    },

    signature: {
        type: String, // Razorpay signature
        default: null,
    },
    paymentDetails: mongoose.Schema.Types.Mixed,
    message: { type: String },
    receiptUrl: { type: String },
    approvalStatus: { type: String, enum: ['Requested', 'Accepted', 'Rejected'], default: 'Requested' },
    paymentDate: { type: Date, default: Date.now }


}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
