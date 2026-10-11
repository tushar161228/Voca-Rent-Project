const BaseController = require("../core/BaseController");
const Rent = require("../models/Rent");
const Lease = require("../models/Lease");
const config = require("../config");
const Room = require("../models/Room");
const User = require("../models/User");
const Tenant = require("../models/Tenants");

const RentController = new BaseController(Rent, {
  name: "Rent",
  access: "user",
  accessKey: "tenantId", // Tenants can view their own rent
  get: {
    pagination: config.pagination,
    query: ["status", "roomId"],
    populate: [
      { path: "tenantId", select: "name mobile email address" },
      {
        path: "roomId", select: "roomNumber propertyId status monthlyRent",
        populate: { path: "propertyId", select: "name" },
      },
    ],

    pre: async (filter, req) => {
      if (req.query.search) {

        const regex = new RegExp(req.query.search, "i");

        const users = await Tenant.find({
          $or: [
            { name: { $regex: regex } },
            { mobile: { $regex: regex } }, 
            {email: {$regex: regex} }
          ]
        }).select("_id");

        if (users.length > 0) {
          filter.tenantId = { $in: users.map(u => u._id) };
        } else {
             filter._id = null;
        }
      }

      return filter;
    },
  },
  getById: {
    populate: [
      // {path:"leaseId",select:""},
      { path: "tenantId", select: "name mobile email address" },
      {
        path: "roomId", select: "roomNumber propertyId status monthlyRent",
        populate: { path: "propertyId", select: "name" },
      },
    ],
  },
});

//Get all rents for their tenants
RentController.getOwnerRents = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const count = await Rent.countDocuments({});
    const rents = await Rent.find().populate({
      path: "leaseId",
      match: { ownerId: ownerId },
    });

    const filteredRents = rents.filter((r) => r.leaseId);
    return res.status(200).json({
      message: "Owner rents fetched",
      data: filteredRents,
      count: count,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Server error" });
  }
};

RentController.getDueRent = async (req, res) => {
  try {
    const rents = await Rent.find({
      tenantId: req.user._id,
      status: { $in: ["Pending", "Overdue", "Partially Paid"] },
    })
      .populate([
        {
          populate: [{ path: "ownerId", select: "name mobile" }],
        },
        { path: "tenantId", select: "name mobile email" },
        { path: "roomId" },
      ])
      .sort({ dueDate: 1 });

    return res.status(200).json({
      message: "Due rent fetched successfully",
      data: rents,
      count: rents.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Server error" });
  }
};

const ownerRentController = new BaseController(Rent, {
  name: "Rent",
  access: "user",
  accessKey: "ownerId",
  get: {
    pagination: config.pagination,
    query: ["status", "roomId"],

    populate: [
      { path: "tenantId", select: "name mobile" },
      { path: "roomId", select: "roomNumber monthlyRent status" },
    ],

    pre: async (filter, req) => {
      if (req.query.search) {

        const regex = new RegExp(req.query.search, "i");

        const users = await Tenant.find({
          $or: [
            { name: { $regex: regex } },
            { mobile: { $regex: regex } },
            {email: {$regex: regex} }
          ]
        }).select("_id");

        // tenant found
        if (users.length > 0) {

          filter.tenantId = {
            $in: users.map(u => u._id)
          };

        } else {

          // no data return
          filter._id = null;
        }
      }

      return filter;
    },
  },
  getById: {
    populate: [
      { path: "tenantId", select: "name mobile" },
      { path: "roomId", select: "" },
    ],
  },
});


ownerRentController.ownerRentDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const ownerRooms = await Room.find({ ownerId }).select("_id");

    const roomIds = ownerRooms.map((room) => room._id);

    const statusCounts = await Rent.aggregate([
      {
        $match: {
          roomId: { $in: roomIds },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      Paid: 0,
      Pending: 0,
      Overdue: 0,
      "Partially Paid": 0,
    };

    statusCounts.forEach(({ _id, count }) => {
      if (counts.hasOwnProperty(_id)) {
        counts[_id] = count;
      }
    });

    const totalRents = Object.values(counts).reduce((a, b) => a + b, 0);

    // 3️⃣ Revenue stats — total collected
    const revenueStats = await Rent.aggregate([
      {
        $match: {
          roomId: { $in: roomIds },
        },
      },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: "$paidAmount" },
        },
      },
    ]);

    // 4️⃣ Total outstanding
    const outstandingStats = await Rent.aggregate([
      {
        $match: {
          roomId: { $in: roomIds },
          status: { $in: ["Pending", "Overdue", "Partially Paid"] },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: {
          path: "$room",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          totalOutstanding: {
            $sum: {
              $subtract: [
                { $ifNull: ["$room.monthlyRent", 0] },
                { $ifNull: ["$paidAmount", 0] },
              ],
            },
          },
        },
      },
    ]);

    const totalCollected = revenueStats[0]?.totalCollected || 0;
    const totalOutstanding = outstandingStats[0]?.totalOutstanding || 0;

    // 5️⃣ Recent overdue rents
    const recentOverdue = await Rent.find({
      roomId: { $in: roomIds },
      status: "Overdue",
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate({
        path: "tenantId",
        select: "name mobile email",
      })
      .populate({
        path: "roomId",
        select: "roomNumber monthlyRent propertyId",
        populate: {
          path: "propertyId",
          select: "name",
        },
      });

    return res.status(200).json({
      message: "Owner rent dashboard fetched successfully",
      data: {
        summary: {
          totalRents,
          paid: counts["Paid"],
          pending: counts["Pending"],
          overdue: counts["Overdue"],
          partiallyPaid: counts["Partially Paid"],
        },
        revenue: {
          totalCollected,
          totalOutstanding,
        },
        recentOverdue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const adminRentController = new BaseController(Rent, {
  name: "Rent",
  access: "admin",

  get: {
    pagination: config.pagination,
    query: ["status", "roomId"],
    populate: [
      { path: "tenantId", select: "name mobile email address" },
      {
        path: "roomId", select: "roomNumber propertyId status monthlyRent",
        populate: { path: "propertyId", select: "name" },
      },
    ],


    pre: async (filter, req) => {
      if (req.query.search) {

        const regex = new RegExp(req.query.search, "i");

        const users = await Tenant.find({
          $or: [
            { name: { $regex: regex } },
            { mobile: { $regex: regex } },
             {email: {$regex: regex} }
          ]
        }).select("_id");

        if (users.length > 0) {
          filter.tenantId = { $in: users.map(u => u._id) };
        } else {
          filter._id = null;
        }
      }

      return filter;
    },

  },
  getById: {
    populate: [
      { path: "tenantId", select: "name mobile email address" },
      {
        path: "roomId", select: "roomNumber propertyId status monthlyRent",
        populate: { path: "propertyId", select: "name" },
      },
    ],
  },


})


// adminRentController.adminRentDashboard = async (req, res) => {
//   try {
//     // 1️⃣ Rent counts by status
//     const statusCounts = await Rent.aggregate([
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     const counts = { Paid: 0, Pending: 0, Overdue: 0, "Partially Paid": 0 };
//     statusCounts.forEach(({ _id, count }) => {
//       if (counts.hasOwnProperty(_id)) counts[_id] = count;
//     });

//     const totalRents = Object.values(counts).reduce((a, b) => a + b, 0);

//     // 2️⃣ Revenue stats — total collected (paidAmount) & total outstanding
//     const revenueStats = await Rent.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalCollected: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     // Outstanding = rents that are not fully Paid
//     const outstandingStats = await Rent.aggregate([
//       {
//         $match: { status: { $in: ["Pending", "Overdue", "Partially Paid"] } },
//       },
//       {
//         $lookup: {
//           from: "rooms",
//           localField: "roomId",
//           foreignField: "_id",
//           as: "room",
//         },
//       },
//       { $unwind: { path: "$room", preserveNullAndEmpty: true } },
//       {
//         $group: {
//           _id: null,
//           totalOutstanding: {
//             $sum: {
//               $subtract: [
//                 { $ifNull: ["$room.monthlyRent", 0] },
//                 { $ifNull: ["$paidAmount", 0] },
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     const totalCollected = revenueStats[0]?.totalCollected || 0;
//     const totalOutstanding = outstandingStats[0]?.totalOutstanding || 0;

//     // 3️⃣ Recent overdue rents (latest 5)
//     const recentOverdue = await Rent.find({ status: "Overdue" })
//       .sort({ dueDate: 1 })
//       .limit(5)
//       .populate({ path: "tenantId", select: "name mobile email" })
//       .populate({
//         path: "roomId",
//         select: "roomNumber monthlyRent propertyId",
//         populate: { path: "propertyId", select: "name" },
//       });

//     return res.status(200).json({
//       message: "Admin rent dashboard fetched successfully",
//       data: {
//         summary: {
//           totalRents,
//           paid: counts["Paid"],
//           pending: counts["Pending"],
//           overdue: counts["Overdue"],
//           partiallyPaid: counts["Partially Paid"],
//         },
//         revenue: {
//           totalCollected,
//           totalOutstanding,
//         },
//         recentOverdue,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

module.exports = { RentController, ownerRentController, adminRentController };
