const BaseController = require("../core/BaseController");
const Payment = require("../models/Payment");
const Rent = require("../models/Rent");
const config = require("../config");
const Room = require("../models/Room")
const User = require("../models/User")

const ownerPaymentController = new BaseController(Payment, {
  name: "Payment",
  // access: "user",
  // accessKey: "tenantId",
  get: {
    pagination: config.pagination,
    populate: [{ path: "rentId", select: "message amount roomId dueDate", populate: [{ path: "roomId", select: "roomNumber" }] },{path:"subscription",select:"title durationDays"},{path:"ownerId",select:"name mobile email address"}],
    query: ["approvalStatus","status","type"],
    pre: async (filter, req) => {
      filter.ownerId = req.user._id;
    }

  },
  create: {
    pre: async (payload, req) => {
      payload.ownerId = req.user._id;
    }
  },
});


const adminPaymentController = new BaseController(Payment, {
  name: "Payment",
  // access: "user",
  // accessKey: "tenantId",
  get: {
    pagination: config.pagination,
    populate: [{ path: "rentId", select: "message  roomId dueDate", populate: [{ path: "roomId", select: "roomNumber monthlyRent" }] },
    { path: "tenantId", select: "name mobile email address" }, { path: "ownerId", select: "name mobile email address" }, { path: "subscription", select: "title durationDays" }
    ],
    query: ["approvalStatus","status","type"],
    // pre: async (filter, req) => {
    //   filter.ownerId = req.user._id;
    // }

    pre: async (filter, req) => {
      const mongoose = require("mongoose");

      // Dedicated subscriptionId query parameter
      if (req.query.subscription?.trim()) {
        const subId = req.query.subscription.trim();
        if (mongoose.Types.ObjectId.isValid(subId)) {
          filter.subscription = new mongoose.Types.ObjectId(subId);
        }
      }

      // General search: name, mobile, razorpayOrderId
      if (req.query.search?.trim()) {

        const search = req.query.search.trim();

        const regex = new RegExp(search, "i");

        const users = await User.find({
          $or: [
            { name: regex },
            { mobile: regex }
          ]
        }).select("_id");

        const userIds = users.map(u => u._id);

        filter.$or = [
          { razorpayOrderId: regex }
        ];

        if (userIds.length > 0) {
          filter.$or.push({
            ownerId: { $in: userIds }
          });
        }
      }

      return filter;
    },

  },

  getById: {
    populate: [{ path: "rentId", select: "message  roomId dueDate", populate: [{ path: "roomId", select: "roomNumber monthlyRent" }] },
    { path: "tenantId", select: "name mobile email address" }, { path: "ownerId", select: "name mobile email address" }, { path: "subscription", select: "title durationDays" }
    ],
  },
});


adminPaymentController.paymentDashboard = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      { $match: { type: 'subscription' } },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'pending']] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $in: ['$status', ['Failed', 'failed']] }, 1, 0] } },
          paid: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'completed', 'paid', 'Paid']] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'completed', 'paid', 'Paid']] }, '$amount', 0] } }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { pending: 0, failed: 0, paid: 0, revenue: 0 };
    delete result._id;

    return res.status(200).json({
      message: "Subscription payment dashboard stats fetched successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, message: 'Server error' });
  }
}

ownerPaymentController.approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ _id: id, ownerId: req.user._id });
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    payment.approvalStatus = "Accepted";
    payment.status = "Completed";
    await payment.save();

    // Update Rent status
    if (payment.rentId) {
      const rent = await Rent.findById(payment.rentId);
      if (rent) {
        rent.status = "Paid";
        rent.paidAmount = payment.amount;
        rent.paymentDate = payment.paymentDate;
        await rent.save();

        // Update Room status to Occupied
        if (rent.roomId) {
          await Room.findByIdAndUpdate(rent.roomId, {
            status: "Occupied",
          });
        }
      }
    }

    return res.status(200).json({
      message: "Payment approved successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Server error",
    });
  }
};


ownerPaymentController.ownerPaymentDashboard = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const stats = await Payment.aggregate([
      { $match: { ownerId: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'pending']] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $in: ['$status', ['Failed', 'failed']] }, 1, 0] } },
          success: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'completed', 'paid', 'Paid', 'Success', 'success']] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'completed', 'paid', 'Paid', 'Success', 'success']] }, '$amount', 0] } }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { pending: 0, failed: 0, success: 0, revenue: 0 };
    delete result._id;

    return res.status(200).json({
      message: "Payment dashboard stats fetched successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, message: 'Server error' });
  }
}

const PaymentController = new BaseController(Payment, {
  name: "Payment",
  access: "user",
  accessKey: "tenantId",
  get: {
    pagination: config.pagination,
    populate: [{
      path: "rentId", select: "status paidAmount paymentDate roomId ",
      populate: { path: "roomId", select: "roomNumber monthlyRent" },
    },

    ],
  },
  create: {
    pre: async (payload, req, res) => {
      if (!payload.rentId) {
        return res.status(400).json({ message: "rentId is required" });
      }

      const rent = await Rent.findOne({ _id: payload.rentId, tenantId: req.user._id }).populate("leaseId");
      if (!rent) {
        return res.status(404).json({ message: "Rent not found" });
      }
      if (rent.status === "Paid") {
        return res.status(400).json({ message: "Rent already paid" });
      }

      payload.tenantId = req.user._id;
      payload.roomId = rent.roomId;
      payload.ownerId = rent.leaseId?.ownerId;
      payload.amount = payload.amount || rent.amount - rent.paidAmount;
      payload.approvalStatus = "Requested";
      payload.status = payload.paymentMethod === "Cash" ? "Pending" : "Completed";
    }
  }
});

// PaymentController.createOrder = async (req, res) => {
//   try {
//     const { rentId, amount } = req.body;
//     if (!rentId) return res.status(400).json({ message: "rentId is required" });

//     const rent = await Rent.findOne({ _id: rentId, tenantId: req.user._id });
//     if (!rent) return res.status(404).json({ message: "Rent not found" });

//     return res.status(200).json({
//       message: "Payment order created successfully",
//       data: {
//         orderId: `order_${Date.now()}`,
//         rentId,
//         amount: amount || rent.amount - rent.paidAmount,
//         currency: "INR"
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// PaymentController.verifyPayment = async (req, res) => {
//   try {
//     const { rentId, amount, transactionId, paymentMethod = "Online" } = req.body;
//     if (!rentId || !transactionId) {
//       return res.status(400).json({ message: "rentId and transactionId are required" });
//     }

//     const rent = await Rent.findOne({ _id: rentId, tenantId: req.user._id }).populate("leaseId");
//     if (!rent) return res.status(404).json({ message: "Rent not found" });

//     const payment = await Payment.create({
//       tenantId: req.user._id,
//       ownerId: rent.leaseId?.ownerId,
//       roomId: rent.roomId,
//       rentId: rent._id,
//       amount: amount || rent.amount - rent.paidAmount,
//       paymentMethod,
//       transactionId,
//       status: "Completed",
//       approvalStatus: "Requested"
//     });

//     return res.status(201).json({
//       message: "Payment submitted successfully",
//       data: payment
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

module.exports = { PaymentController, ownerPaymentController, adminPaymentController };
