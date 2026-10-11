const Property = require("../models/Property");
const Room = require("../models/Room");
const Tenant = require("../models/Tenants"); // Used where tenants are Users
const TenantModel = require("../models/Tenants"); // Standalone Tenant model
const Rent = require("../models/Rent");
const Payment = require("../models/Payment");
const Lease = require("../models/Lease");
const mongoose = require("mongoose");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

class DashboardController {
  async getOwnerStats(req, res) {
    try {
      const ownerId = req.user._id;

      const propertyCount = await Property.countDocuments({ ownerId });
      const roomCount = await Room.find()
        .populate({
          path: "propertyId",
          // match: { ownerId },
        })
        .then((rooms) => rooms.filter((r) => r.propertyId).length);

      const tenants = await Tenant.countDocuments({ role: "Tenant" }); // Simplified, should be linked to owner leases

      const totalRentCollected = await Payment.aggregate([
        { $match: { status: "Completed" } }, // Again, simplified for owner
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      return res.status(200).json({
        message: "Dashboard stats fetched",
        data: {
          properties: propertyCount,
          // rooms: roomCount,
          tenants: tenants,
          totalCollected: totalRentCollected[0]
            ? totalRentCollected[0].total
            : 0,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Server error" });
    }
  }


  async getRoomsDashboard(req, res) {
    try {
      const { propertyId } = req.params;

      const totalRooms = await Room.countDocuments({ propertyId });

      const occupied = await Room.countDocuments({
        propertyId,
        status: "Occupied",
      });

      // 2. Total Potential Rent (sum of all rooms' monthlyRent)
      const totalRentResult = await Room.aggregate([
        { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
        { $group: { _id: null, total: { $sum: "$monthlyRent" } } },
      ]);
      const totalRent = totalRentResult.length > 0 ? totalRentResult[0].total : 0;
      const rooms = await Room.find({ propertyId }).select("_id");
      const roomIds = rooms.map((r) => r._id);
      const collectedResult = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
          },
        },
        {
          $group: { _id: null, total: { $sum: "$paidAmount" } },
        },
      ]);
      const collected = collectedResult.length > 0 ? collectedResult[0].total : 0;

      return res.status(200).json({
        message: "Property dashboard fetched successfully",
        data: {
          totalRooms,
          occupied,
          available: totalRooms - occupied,
          totalRent,
          collected,
        },
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      return res.status(500).json({
        message: "Error fetching property dashboard",
        error: error.message,
      });
    }
  }

  async getRentCards(req, res) {
    const ownerId = req.user.id;
    try {
      const paidRents = await Rent.countDocuments({ status: "Paid", ownerId });
      const pendingRents = await Rent.countDocuments({ status: "Pending", ownerId });
      const overdueRents = await Rent.countDocuments({ status: "Overdue", ownerId });
      return res.status(200).json({
        message: "Rent dashboard fetched successfully",
        data: {
          paidRents,
          pendingRents,
          overdueRents,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching rent dashboard",
        error: error.message,
      });
    }
  }

  getRentDashboard = async (req, res) => {
    try {
      const ownerId = req.user._id;

      const currentYear = new Date().getFullYear();

      // TOTAL RENT COLLECTED (Last 12 months)
      const totalCollected = await Payment.aggregate([
        {
          $match: {
            status: "Paid",
            createdAt: {
              $gte: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1),
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      //PENDING RENT
      const pendingData = await Payment.aggregate([
        {
          $match: {
            status: "Pending",
          },
        },
        {
          $group: {
            _id: null,
            totalPending: { $sum: { $subtract: ["$amount", { $ifNull: ["$paidAmount", 0] }] } },
            unpaidUnits: { $sum: 1 },
          },
        },
      ]);

      //OCCUPANCY
      const totalRooms = await Room.countDocuments({});
      const occupiedRooms = await Room.countDocuments({
        status: "Occupied",
      });

      const occupancyRate =
        totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

      // 4️⃣ LAST MONTH COMPARISON
      const now = new Date();

      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const currentMonthTotal = await Payment.aggregate([
        {
          $match: {
            status: "Paid",
            paymentDate: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const lastMonthTotal = await Payment.aggregate([
        {
          $match: {
            status: "Paid",
            paymentDate: {
              $gte: new Date(lastMonthYear, lastMonth, 1),
              $lte: new Date(lastMonthYear, lastMonth + 1, 0),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const currentTotal = currentMonthTotal[0]?.total || 0;
      const prevTotal = lastMonthTotal[0]?.total || 0;

      let percentageChange = 0;
      if (prevTotal > 0) {
        percentageChange = (
          ((currentTotal - prevTotal) / prevTotal) *
          100
        ).toFixed(1);
      }

      return res.status(200).json({
        success: true,
        data: {
          totalCollected: totalCollected[0]?.total || 0,
          pendingAmount: pendingData[0]?.totalPending || 0,
          unpaidUnits: pendingData[0]?.unpaidUnits || 0,
          occupancy: {
            occupiedRooms,
            totalRooms,
            // percentage: occupancyRate,
          },
          growth: {
            currentMonth: currentTotal,
            lastMonth: prevTotal,
            // percentageChange,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching rent dashboard",
        error: error.message,
      });
    }
  };

  getPerformanceChart = async (req, res) => {
    try {
      const ownerId = req.user._id;

      const properties = await Property.find({ ownerId });

      const data = [];

      for (const property of properties) {
        // Find rooms for this property
        const rooms = await Room.find({ propertyId: property._id });
        const roomIds = rooms.map(room => room._id);

        const totalRent = rooms.reduce((sum, room) => sum + (room.monthlyRent || 0), 0);

        const rentData = await Rent.aggregate([
          {
            $match: {
              roomId: { $in: roomIds },
              status: "Paid"
            }
          },
          {
            $group: {
              _id: null,
              totalPaid: { $sum: "$paidAmount" }
            }
          }
        ]);

        const totalCollection = rentData.length > 0 ? rentData[0].totalPaid : 0;

        data.push({
          _id: property._id,
          propertyName: property.name,
          totalRent,
          totalCollection
        });
      }

      data.sort((a, b) => b.totalCollection - a.totalCollection);

      return res.status(200).json({
        message: "Performance data fetched successfully",
        data
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error fetching performance data",
        error: error.message
      });
    }
  };

  getMonthlyDashboard = async (req, res) => {
    try {
      const ownerId = new mongoose.Types.ObjectId(req.user._id);
      const currentYear = new Date().getFullYear();
      const currentMonthIndex = new Date().getMonth();

      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      const ownerProperties = await Property.find({ ownerId }).select("_id");
      const propertyIds = ownerProperties.map((p) => p._id);

      const ownerRooms = await Room.find({ propertyId: { $in: propertyIds } }).select("_id");
      const roomIds = ownerRooms.map((r) => r._id);

      const rentStats = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            collected: {
              $sum: {
                $cond: [{ $eq: ["$status", "Paid"] }, "$paidAmount", 0],
              },
            },
            pending: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["Pending", "Overdue", "PartiallyPaid"]] },
                  { $subtract: ["$amount", "$paidAmount"] },
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const statsMap = {};
      rentStats.forEach((s) => {
        statsMap[s._id] = { collected: s.collected, pending: s.pending };
      });

      const data = MONTH_NAMES.slice(0, currentMonthIndex + 1).map((name, i) => {
        const monthNum = i + 1;
        return {
          month: name,
          collected: statsMap[monthNum]?.collected || 0,
          pending: statsMap[monthNum]?.pending || 0,
        };
      });

      return res.status(200).json({
        message: "Monthly dashboard fetched successfully",
        data,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error fetching monthly dashboard",
        error: error.message,
      });
    }
  };


  getOverviewCards = async (req, res) => {
    try {
      const ownerId = new mongoose.Types.ObjectId(req.user._id);

      const propertiesCount = await Property.countDocuments({ ownerId });
      const activeTenants = await TenantModel.countDocuments({ createdBy: ownerId });

      const stats = await Rent.aggregate([
        { $match: { ownerId } },
        {
          $group: {
            _id: null,
            totalCollected: {
              $sum: {
                $cond: [{ $eq: ["$status", "Paid"] }, "$paidAmount", 0],
              },
            },
            // pending = remaining due on Pending / Overdue / PartiallyPaid rents
            totalPending: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["Pending", "Overdue", "PartiallyPaid"]] },
                  { $subtract: ["$amount", "$paidAmount"] },
                  0,
                ],
              },
            },
          },
        },
      ]);

      const collected = stats[0]?.totalCollected || 0;
      const pending = stats[0]?.totalPending || 0;

      return res.status(200).json({
        success: true,
        data: {
          properties: propertiesCount,
          tenants: activeTenants,
          collected,
          pending,
        },
      });
    } catch (error) {
      console.error("Overview Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching overview dashboard",
        error: error.message,
      });
    }
  };

getAdminPropertyCards = async (req, res) => {
  try {
    const matchStage = {};

    // Apply filter only if ownerId is provided in query params
    if (req.query.ownerId) {
      matchStage.ownerId = new mongoose.Types.ObjectId(
        req.query.ownerId
      );
    }

    // Search by owner name, owner mobile or property name
    if (req.query.search) {
      const regex = { $regex: req.query.search, $options: "i" };

      matchStage.$or = [
        { "owner.name": regex },
        { "owner.mobile": regex },
        { name: regex } // Property Name
      ];
    }

    // Filter by owner name
    if (req.query.name) {
      const nameRegex = { $regex: req.query.name, $options: "i" };
      matchStage["owner.name"] = nameRegex;
    }

    // Filter by owner mobile
    if (req.query.mobile) {
      const mobileRegex = { $regex: req.query.mobile, $options: "i" };
      matchStage["owner.mobile"] = mobileRegex;
    }

    // Filter by property name
    if (req.query.propertyName) {
      const propertyRegex = {
        $regex: req.query.propertyName,
        $options: "i",
      };

      matchStage.name = propertyRegex;
    }

    const properties = await Property.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },

      // Apply filters
      {
        $match: matchStage,
      },

      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "propertyId",
          as: "rooms",
        },
      },
      {
        $addFields: {
          totalRooms: {
            $size: "$rooms",
          },
          availableRooms: {
            $size: {
              $filter: {
                input: "$rooms",
                as: "room",
                cond: {
                  $eq: ["$$room.status", "Available"],
                },
              },
            },
          },
          occupiedRooms: {
            $size: {
              $filter: {
                input: "$rooms",
                as: "room",
                cond: {
                  $eq: ["$$room.status", "Occupied"],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          rooms: 0,
          owner: 0,
        },
      },
    ]);

    const totalProperties = properties.length;

    const totalRooms = properties.reduce(
      (sum, p) => sum + p.totalRooms,
      0
    );

    const totalAvailable = properties.reduce(
      (sum, p) => sum + p.availableRooms,
      0
    );

    const totalOccupied = properties.reduce(
      (sum, p) => sum + p.occupiedRooms,
      0
    );

    return res.status(200).json({
      message: "property cards fetched successfully",
      data: {
        totalProperties,
        totalRooms,
        totalAvailable,
        totalOccupied,
      },
    });
  } catch (error) {
    console.error("Admin Property Cards Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching admin property cards",
      error: error.message,
    });
  }
};



  adminRentDashboard = async (req, res) => {
    try {
      const paidRents = await Rent.countDocuments({ status: "Paid" });
      const pendingRents = await Rent.countDocuments({ status: "Pending" });
      const overdueRents = await Rent.countDocuments({ status: "Overdue" });

      const paidAmountResult = await Rent.aggregate([
        { $match: { status: "Paid" } },
        { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } },
      ]);
      const totalPaidAmount = paidAmountResult[0]?.totalPaidAmount || 0;

      return res.status(200).json({
        message: "Rent dashboard fetched successfully",
        data: {
          paidRents,
          pendingRents,
          overdueRents,
          totalPaidAmount,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching rent dashboard",
        error: error.message,
      });
    }
  }


  getDashboardStats = async (req, res) => {
    try {
      const [
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        paymentStats
      ] = await Promise.all([
        User.countDocuments({ role: "owner" }),
       
        Subscription.countDocuments(),
        

        User.countDocuments({ "subscription.isActive": true }), // Users who purchased subscription

        User.aggregate([
          {
            $match: { "subscription.isActive": true }
          },
          {
            $group: {
              _id: null,
              totalPaidAmount: { $sum: "$subscription.amount" }
            }
          }
        ])
      ]);
     const totalTenant=await Tenant.countDocuments();

      const totalRevenue =
        paymentStats.length > 0 ? paymentStats[0].totalPaidAmount : 0;

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalTenant,
          totalSubscriptions,
          activeSubscriptions,
          totalRevenue
        }
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data"
      });
    }
  }



  getPaymentGraph = async (req, res) => {
    try {
      let { year, month } = req.query;
      const now = new Date();
      const MONTH_NAMES = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
      ];
      year = year ? parseInt(year) : now.getFullYear();
      month = month ? parseInt(month) : null;

      let startDate, endDate, groupStage, labelType, totalSlots;


      if (year && month) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
        totalSlots = new Date(year, month, 0).getDate();

        groupStage = {
          _id: {
            day: { $dayOfMonth: "$paymentDate" },
            status: "$status"
          },
          totalAmount: { $sum: "$paidAmount" }
        };

        labelType = "day";
      }


      else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
        totalSlots = 12;

        groupStage = {
          _id: {
            month: { $month: "$paymentDate" },
            status: "$status"
          },
          totalAmount: { $sum: "$paidAmount" }
        };

        labelType = "month";
      }

      const data = await Rent.aggregate([
        { $match: { paymentDate: { $gte: startDate, $lte: endDate } } },
        { $group: groupStage }
      ]);


      const graph = {};

      for (let i = 1; i <= totalSlots; i++) {
        const label =
          labelType === "day"
            ? `Day ${i}`
            : MONTH_NAMES[i - 1];

        graph[label] = {
          Paid: 0,
          Pending: 0,
          Overdue: 0,
          PartiallyPaid: 0,
        };
      }


      data.forEach(item => {
        const index =
          labelType === "day" ? item._id.day : item._id.month;

        const label =
          labelType === "day"
            ? `Day ${index}`
            : MONTH_NAMES[index - 1];

        graph[label][item._id.status] = item.totalAmount;
      });

      return res.status(200).json({
        success: true,
        message: "Payment graph data of rent fetched successfully",
        // filter: {
        //   year,
        //   month: month || "ALL"
        // },
        // view: labelType === "day" ? "DAY_WISE" : "MONTH_WISE",
        data: graph
      });
    } catch (error) {
      console.error("Payment Graph Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load payment graph"
      });
    }
  };


  subscriptionDashboard = async (req, res) => {
    try {
      const data = await User.aggregate([
        {
          $match: {
            // "type":"Subscription",
            "subscription.isActive": true,
            "subscription.planName": { $ne: null }
          }
        },

        {
          $group: {
            _id: "$subscription.planName",
            count: { $sum: 1 }
          }
        },

        {
          $project: {
            _id: 0,
            planName: "$_id",
            count: 1
          }
        },

        {
          $sort: { count: -1 }
        }
      ]);

      const totalActiveUsers = data.reduce((sum, p) => sum + p.count, 0);

      return res.status(200).json({
        success: true,
        totalActiveUsers,
        data
      });

    } catch (error) {
      console.error("Subscription Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load subscription dashboard"
      });
    }
  };


  ownerRentDashboard = async (req, res) => {
    try {
      const ownerId = req.user._id;
      const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

      const properties = await Property.find({ ownerId }).select("_id");
      const propertyIds = properties.map((p) => p._id);


      const rooms = await Room.find({ propertyId: { $in: propertyIds } }).select("_id status");
      const roomIds = rooms.map((r) => r._id);


      const [paidRents, pendingRents, overdueRents] = await Promise.all([
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Paid" }),
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Pending" }),
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Overdue" }),
      ]);

      // ── 4. Total Paid Amount via roomIds ──────────────────────────────
      const paidAmountResult = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalPaidAmount: { $sum: "$paidAmount" },
          },
        },
      ]);

      const totalPaidAmount = paidAmountResult[0]?.totalPaidAmount || 0;

      return res.status(200).json({
        message: "Owner rent dashboard fetched successfully",
        data: {
          paidRents,
          pendingRents,
          overdueRents,
          totalPaidAmount,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching owner rent dashboard",
        error: error.message,
      });
    }
  };


  ownerDasboard = async (req, res) => {
    try {
      const ownerId = req.user._id;

      const properties = await Property.find({ ownerId }).select("_id");
      const propertyIds = properties.map((p) => p._id);

      const rooms = await Room.find({ propertyId: { $in: propertyIds } }).select("_id status");
      const roomIds = rooms.map((r) => r._id);

      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter((r) => r.status === "Occupied").length;

      // Total Paid Amount
      const paidAmountResult = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalPaidAmount: { $sum: "$paidAmount" },
          },
        },
      ]);
      const totalPaidAmount = paidAmountResult[0]?.totalPaidAmount || 0;

      // Total Pending Amount
      const pendingAmountResult = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: { $in: ["Pending", "Overdue", "PartiallyPaid"] },
          },
        },
        {
          $group: {
            _id: null,
            totalPendingAmount: {
              $sum: {
                $cond: [
                  { $gt: [{ $subtract: ["$amount", "$paidAmount"] }, 0] },
                  { $subtract: ["$amount", "$paidAmount"] },
                  0
                ]
              }
            },
          },
        },
      ]);
      const totalPendingAmount = pendingAmountResult[0]?.totalPendingAmount || 0;

      return res.status(200).json({
        success: true,
        message: "Owner dashboard fetched successfully",
        data: {
          totalRooms,
          occupiedRooms,
          totalPaidAmount,
          totalPendingAmount,
        },
      });
    } catch (error) {
      console.error("Owner Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching owner dashboard",
        error: error.message,
      });
    }
  }


  appDasboard = async (req, res) => {
    try {
      const ownerId = new mongoose.Types.ObjectId(req.user._id);

      // 1. Get owner's properties and rooms
      const properties = await Property.find({ ownerId });
      const propertyIds = properties.map((p) => p._id);

      const rooms = await Room.find({ propertyId: { $in: propertyIds } });
      const roomIds = rooms.map((r) => r._id);

      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter((r) => r.status === "Occupied").length;
      const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

      const now = new Date();
      const last12MonthsDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      // 2. Top Stats: Total Collected & Pending Amount
      const totalCollectedAgg = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
            createdAt: { $gte: last12MonthsDate }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $gt: [{ $ifNull: ["$paidAmount", 0] }, 0] },
                  "$paidAmount",
                  "$amount"
                ]
              }
            }
          }
        }
      ]);
      const totalCollected = totalCollectedAgg[0]?.total || 0;

      const pendingDataAgg = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: { $in: ["Pending", "Overdue", "PartiallyPaid"] },
          }
        },
        {
          $group: {
            _id: null,
            totalPending: {
              $sum: {
                $cond: [
                  { $gt: [{ $subtract: ["$amount", "$paidAmount"] }, 0] },
                  { $subtract: ["$amount", "$paidAmount"] },
                  0
                ]
              }
            },
            unpaidUnits: { $sum: 1 }
          }
        }
      ]);
      const pendingAmount = pendingDataAgg[0]?.totalPending || 0;
      const unpaidUnits = pendingDataAgg[0]?.unpaidUnits || 0;

      // 3. Last Month Comparison
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const paidAmountExpr = {
        $cond: [
          { $gt: [{ $ifNull: ["$paidAmount", 0] }, 0] },
          "$paidAmount",
          "$amount"
        ]
      };

      // updatedAt use karo: rent kisi bhi month mein create ho sakta hai
      // lekin payment (Paid status) updatedAt pe hoti hai
      const currentMonthTotalAgg = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
            updatedAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: new Date(),
            },
          },
        },
        { $group: { _id: null, total: { $sum: paidAmountExpr } } }
      ]);

      const lastMonthTotalAgg = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            status: "Paid",
            updatedAt: {
              $gte: new Date(lastMonthYear, lastMonth, 1),
              $lte: new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999),
            },
          },
        },
        { $group: { _id: null, total: { $sum: paidAmountExpr } } }
      ]);

      
      const currentTotal = currentMonthTotalAgg[0]?.total || 0;
      const prevTotal = lastMonthTotalAgg[0]?.total || 0;

      let percentageChange = 0;
      if (prevTotal > 0) {
        const change = ((currentTotal - prevTotal) / prevTotal) * 100;
        percentageChange = Math.max(0, parseFloat(change.toFixed(1)));
      }

      // 4. Tenant Status
      const [paidCount, pendingCount, overdueCount] = await Promise.all([
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Paid" }),
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Pending" }),
        Rent.countDocuments({ roomId: { $in: roomIds }, status: "Overdue" }),
      ]);

      // 5. Performance Chart Data
      const performanceData = [];
      for (const property of properties) {
        const pRooms = rooms.filter(r => r.propertyId.toString() === property._id.toString());
        const pRoomIds = pRooms.map(r => r._id);
        const totalRent = pRooms.reduce((sum, room) => sum + (room.monthlyRent || 0), 0);
        
        const rentData = await Rent.aggregate([
          { $match: { roomId: { $in: pRoomIds }, status: "Paid" } },
          {
            $group: {
              _id: null,
              totalPaid: {
                $sum: {
                  $cond: [
                    { $gt: [{ $ifNull: ["$paidAmount", 0] }, 0] },
                    "$paidAmount",
                    "$amount"
                  ]
                }
              }
            }
          }
        ]);
        const totalCollection = rentData.length > 0 ? rentData[0].totalPaid : 0;
        
        performanceData.push({
          _id: property._id,
          propertyName: property.name,
          totalRent,
          totalCollection
        });
      }
      performanceData.sort((a, b) => b.totalCollection - a.totalCollection);

      // 6. Monthly Collection Trend
      const currentYear = now.getFullYear();
      const currentMonthIndex = now.getMonth();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      const monthlyStats = await Rent.aggregate([
        {
          $match: {
            roomId: { $in: roomIds },
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            collected: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Paid"] },
                  {
                    $cond: [
                      { $gt: [{ $ifNull: ["$paidAmount", 0] }, 0] },
                      "$paidAmount",
                      "$amount"
                    ]
                  },
                  0
                ]
              },
            },
            pending: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["Pending", "Overdue", "PartiallyPaid"]] },
                  {
                    $cond: [
                      { $gt: [{ $subtract: ["$amount", { $ifNull: ["$paidAmount", 0] }] }, 0] },
                      { $subtract: ["$amount", { $ifNull: ["$paidAmount", 0] }] },
                      0
                    ]
                  },
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const statsMap = {};
      monthlyStats.forEach((s) => { statsMap[s._id] = { collected: s.collected, pending: s.pending }; });
      const monthlyData = MONTH_NAMES.slice(0, currentMonthIndex + 1).map((name, i) => {
        const monthNum = i + 1;
        return {
          month: name,
          collected: statsMap[monthNum]?.collected || 0,
          pending: statsMap[monthNum]?.pending || 0,
        };
      });

      return res.status(200).json({
        success: true,
        message: "App dashboard data fetched successfully",
        data: {
          topStats: {
            totalCollected,
            pendingAmount,
            unpaidUnits,
            occupancy: {
              occupiedRooms,
              totalRooms,
              percentage: occupancyRate
            },
            growth: {
              currentMonth: currentTotal,
              lastMonth: prevTotal,
              percentageChange
            }
          },
          tenantStatus: {
            paid: paidCount,
            pending: pendingCount,
            overdue: overdueCount
          },
          performance: performanceData,
          monthlyTrend: monthlyData
        }
      });

    } catch (error) {
      console.error("App Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching app dashboard",
        error: error.message,
      });
    }
  }

}

module.exports = new DashboardController();
