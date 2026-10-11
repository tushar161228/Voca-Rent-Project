const BaseController = require("../core/BaseController")
const Notification = require("../models/Notification")
const config = require("../config")
const user = require("../models/User")
const mongoose = require("mongoose")

const notificationController = new BaseController(Notification, {
  name: "Notification",
  access:"user",
  accessKey:"user",

  get: {
    pagination: config.pagination,
    query: ["type", "status"],
    populate: [
      { path: "user", select: "name email mobile" }
    ]
  }
})


notificationController.allSystemActivity = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch paginated and sorted notifications from the Notification collection
        const activities = await Notification.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    type: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    user: { _id: 1, name: 1, email: 1, mobile: 1 }
                }
            }
        ]);

        const totalItems = await Notification.countDocuments();

        return res.status(200).json({
            message: "Recent activities fetched successfully",
            count: totalItems,
            data: activities
        });
    } catch (error) {
        console.error("All System Activity Error:", error);
        return res.status(500).json({
            message: "Failed to fetch activities",
            error: error.message
        });
    }
}

module.exports = notificationController
