const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    // leaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lease', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    month: { type: Number },
    year: { type: Number },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue', 'PartiallyPaid'], default: 'Pending' },
    paidAmount: { type: Number, default: 0 },
    paymentDate: { type: Date },
    reminderDates: [{type: Date}]
}, { timestamps: true });


module.exports = mongoose.model('Rent', rentSchema);
