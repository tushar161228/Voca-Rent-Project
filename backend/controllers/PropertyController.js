const BaseController = require("../core/BaseController");
const Property = require("../models/Property");
const config = require("../config");
const Room = require("../models/Room");
const User = require("../models/User");
const Tenant = require("../models/Tenants");
const Rent = require("../models/Rent");

const PropertyController = new BaseController(Property, {
  name: "Property",
  access: "user",
  accessKey: "ownerId",
  get: {
    pagination: config.pagination,
    query: ["name"],
    pre: async (filter, req) => {
      if (req.user?.role === "owner") {
        filter.ownerId = req.user._id;
      }
    },
    populate: [{ path: "ownerId", select: "name mobile" }],

    // pre: async (filter, req) => {
    //   if (req.query.search) {
    //     const regex = new RegExp(req.query.search, "i");

    //     const users = await User.find({
    //       $or: [{ name: { $regex: regex } }, { mobile: { $regex: regex } }],
    //     }).select("_id");

    //     if (users.length > 0) {
    //       filter.ownerId = { $in: users.map((u) => u._id) };
    //     } else {
    //       throw new Error("No user found");
    //     }
    //   }

    //   return filter;
    // },

     post: async (data, req) => {
        const OwnerId = req.user._id;
      const properties = JSON.parse(JSON.stringify(data));
      const promises = properties.map(async (prop) => {
        const totalRooms = await Room.countDocuments({ propertyId: prop._id });
        const availableRooms = await Room.countDocuments({
          propertyId: prop._id,
          status: "Available",
        });
        const occupiedRooms = await Room.countDocuments({
          propertyId: prop._id,
          status: "Occupied",
        });

        prop.totalRooms = totalRooms;
        prop.availableRooms = availableRooms;
        prop.occupiedRooms = occupiedRooms;
        return prop;
      });
      return await Promise.all(promises);
    },
  },

  getById: {
    populate: [{ path: "ownerId", select: "name mobile" }],
      post: async (data, req) => {
      const prop = JSON.parse(JSON.stringify(data));
      const totalRooms = await Room.countDocuments({ propertyId: prop._id });
      const availableRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Available",
      });
      const occupiedRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Occupied",
      });

      prop.totalRooms = totalRooms;
      prop.availableRooms = availableRooms;
      prop.occupiedRooms = occupiedRooms;

      return prop;
    },
  },
});

PropertyController.ownerPropertyDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const properties = await Property.find({ ownerId });
    const totalProperties = properties.length;
    const propertyIds = properties.map((p) => p._id);

    const totalTenants = await Tenant.countDocuments({ createdBy: ownerId });

    const rentResult = await Room.aggregate([
      { $match: { propertyId: { $in: propertyIds } } },
      { $group: { _id: null, totalMonthlyRent: { $sum: "$monthlyRent" } } },
    ]);
    const totalMonthlyRent = rentResult.length > 0 ? rentResult[0].totalMonthlyRent : 0;

    return res.status(200).json({
      message: "Owner property dashboard fetched successfully",
      data: {
        totalProperties,
        totalTenants,
        totalMonthlyRent,
      },
    });
  } catch (error) {
    console.error("Owner Property Controller Error:", error);
    return res.status(500).json({
      message: "Error fetching owner property dashboard",
      error: error.message,
    });
  }
};

PropertyController.getRoomByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const rooms = await Room.find({ propertyId }).lean();

    const result = await Promise.all(
      rooms.map(async (room) => {
        const latestRent = await Rent.findOne({ roomId: room._id })
          .sort({ createdAt: -1 })
          .populate({ path: "tenantId", select: "name mobile" })
          .lean();

        return {
          _id: room._id,
          roomNumber: room.roomNumber,
          monthlyRent: room.monthlyRent,
          status: room.status,       
          amenities: room.amenities,
          description: room.description,
          rentStatus: latestRent ? latestRent.status : "Avaiable",
          paidAmount: latestRent ? latestRent.paidAmount : 0,
          dueDate: latestRent ? latestRent.dueDate : null,
          // rentId: latestRent ? latestRent._id : null,
          // Tenant info
          
          tenant: latestRent?.tenantId
            ? {
                _id: latestRent.tenantId._id,
                name: latestRent.tenantId.name,
                mobile: latestRent.tenantId.mobile,
              }
            : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      success: "Rooms fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("getRoomByProperty Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};


const adminPropertyController = new BaseController(Property, {
  name: "Property",
get: {
  pagination: config.pagination,
  query:["ownerId"],

  populate: [
    {
      path: "ownerId",
      select: "name mobile",
    },
  ],

  pre: async (filter, req) => {
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");

      // Search users by name/mobile
      const users = await User.find({
        $or: [
          { name: { $regex: regex } },
          { mobile: { $regex: regex } },
        ],
      }).select("_id");

      const userIds = users.map((u) => u._id);

      // Property name + owner search
      filter.$or = [
        { name: { $regex: regex } }, // property name search
        { ownerId: { $in: userIds } }, // owner name/mobile search
      ];
    }

    return filter;
  },

  post: async (data, req) => {
    const properties = JSON.parse(JSON.stringify(data));

    const promises = properties.map(async (prop) => {
      const totalRooms = await Room.countDocuments({
        propertyId: prop._id,
      });

      const availableRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Available",
      });

      const occupiedRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Occupied",
      });

      prop.totalRooms = totalRooms;
      prop.availableRooms = availableRooms;
      prop.occupiedRooms = occupiedRooms;

      return prop;
    });

    return await Promise.all(promises);
  },
},

  getById: {
    populate: [{ path: "ownerId", select: "name mobile" }],
    post: async (data, req) => {
      const prop = JSON.parse(JSON.stringify(data));
      const totalRooms = await Room.countDocuments({ propertyId: prop._id });
      const availableRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Available",
      });
      const occupiedRooms = await Room.countDocuments({
        propertyId: prop._id,
        status: "Occupied",
      });

      prop.totalRooms = totalRooms;
      prop.availableRooms = availableRooms;
      prop.occupiedRooms = occupiedRooms;

      return prop;
    },
  },
});



module.exports = { PropertyController, adminPropertyController };
