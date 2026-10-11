const BaseController = require("../core/BaseController")
const Subscription = require("../models/Subscription")
const config = require("../config")
const Razorpay = require("razorpay");
const Transaction = require("../models/Payment");
const crypto = require("crypto");
const User = require("../models/User");



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const SubscriptionController = new BaseController(Subscription, {
  name: "Subscription",

  get: {
    pagination: config.pagination,
    pre: (filter) => {
      filter.isActive = true;
    }
  }
})

// SubscriptionController.purchaseSubscription = async (req, res) => {
//   try {
//     let { subscription } = req.body;
//     if (!subscription) {
//       return res.status(400).json({ message: "subscription Id is required" });
//     }

//     // Fetch subscription
//     const subscriptionExist = await Subscription.findById(subscription);

//     if (!subscriptionExist) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Subscription not found" });
//     }

//     // Create Razorpay order
//     const options = {
//       amount: subscriptionExist.price * 100, // convert rupees → paisa
//       // currency: "INR",
//       receipt: "receipt_" + Date.now(),
//       notes: {
//         subscriptionId: subscriptionExist._id.toString(), // save for future reference
//       },
//     };
//     const price = subscriptionExist.price;
//     const order = await razorpay.orders.create(options);
//     await Transaction.create({
//       subscription: subscriptionExist._id,
//       ownerId: req.user._id,
//       razorpayOrderId: order.id,
//       amount: price,

//       type: "subscription",
//       // currency: options.currency,
//       approvalStatus: "Accepted",

//       status: "Pending",
//     });

//     return res.json({
//       message: "Razorpay order created successfully",
//       order,
//       subscription: subscriptionExist,
//     });
//   } catch (error) {
//     console.error("Error purchasing subscription:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };


SubscriptionController.purchaseSubscription = async (req, res) => {
  try {
    let { subscription } = req.body;
    if (!subscription) {
      return res.status(400).json({ message: "subscription Id is required" });
    }

    // Check if the owner has already purchased this subscription in their User profile
    const user = await User.findById(req.user._id);
    if (
      user &&
      user.subscription &&
      user.subscription.isActive &&
      user.subscription.plan &&
      user.subscription.plan.toString() === subscription.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "this subscription is already purchased",
      });
    }

    // Fetch subscription
    const subscriptionExist = await Subscription.findById(subscription);

    if (!subscriptionExist) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    // Create Razorpay order
    const options = {
      amount: subscriptionExist.price * 100, // convert rupees → paisa
      // currency: "INR",
      receipt: "receipt_" + Date.now(),
      notes: {
        subscriptionId: subscriptionExist._id.toString(), // save for future reference
      },
    };
    const price = subscriptionExist.price;
    const order = await razorpay.orders.create(options);
    await Transaction.create({
      subscription: subscriptionExist._id,
      ownerId: req.user._id,
      razorpayOrderId: order.id,
      amount: price,

      type: "subscription",
      // currency: options.currency,
      approvalStatus: "Accepted",

      status: "Pending",
    });

    return res.json({
      message: "Razorpay order created successfully",
      order,
      subscription: subscriptionExist,
    });
  } catch (error) {
    console.error("Error purchasing subscription:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Fetch transaction
    const transaction = await Transaction.findOne({
      razorpayOrderId: razorpay_order_id,
      ownerId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update transaction
    transaction.status = "Completed";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.paymentDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paymentMethod: payment.method,
    };

    await transaction.save();

    // Fetch subscription
    const subscription = await Subscription.findById(
      transaction.subscription
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    const startedAt = new Date();
    const expiresAt = new Date(
      startedAt.getTime() +
        subscription.durationDays * 24 * 60 * 60 * 1000
    );

    // Activate subscription
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        subscription: {
          plan: subscription._id,
          planName: subscription.title,
          amount: transaction.amount,
          startDate: startedAt,
          endDate: expiresAt,
          isActive: true,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// // testing purpose
// const verifyPayment = async (req, res) => {

//   // testing purpose


//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     // TEMPORARY BYPASS FOR POSTMAN TESTING
//     let isValid = true;

//     // ===== ORIGINAL SIGNATURE CHECK =====
//     /*
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign)
//       .digest("hex");

//     let isValid = expectedSign === razorpay_signature;
//     */

//     if (isValid) {

//       // fake payment data for testing
//       const payment = {
//         method: "upi"
//       };

//       let transaction = await Transaction.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         {
//           status: "Paid",
//           paymentDetails: {
//             orderId: razorpay_order_id,
//             paymentId: razorpay_payment_id,
//             signature: razorpay_signature,
//             paymentMethod: payment.method,
//           },
//         },
//         { new: true }
//       ).populate("subscription");

//       if (!transaction) {
//         return res.status(404).json({
//           message: "Transaction not found",
//         });
//       }

//       const startedAt = new Date();

//       const expiresAt = new Date(
//         startedAt.getTime() +
//         transaction.subscription.durationDays *
//         24 *
//         60 *
//         60 *
//         1000
//       );


//       await User.findByIdAndUpdate(req.user._id, {
//         $set: {
//           subscription: {
//             plan: transaction.subscription._id,
//             startDate: startedAt,
//             isActive: true,
//             endDate: expiresAt,
//             planName: transaction.subscription.title,
//             amount: transaction.amount,
//           },
//         },
//       });

//       return res.json({
//         message: "Payment Verified",
//         transaction,
//       });
//     }

//     return res.status(400).json({
//       message: "Invalid Signature",
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };


const adminSubscriptionController = new BaseController(Subscription, {
  name: "Subscription",

  get: {
    pagination: config.pagination,
    query: ["isActive"],
  }
})
module.exports = { SubscriptionController, verifyPayment, adminSubscriptionController }
