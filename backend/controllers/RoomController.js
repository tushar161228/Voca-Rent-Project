const BaseController = require('../core/BaseController');
const Room = require('../models/Room');
const Property = require('../models/Property');
const config = require("../config")

const RoomController = new BaseController(Room, {
    name: 'Room',
    access: 'user',
    accessKey:'ownerId',


    get: {
        pagination: config.pagination,
        populate: ['propertyId'],
        query: ["propertyId"],
        // pre: async (filter, req, res) => {
        //     if (req.user && req.user.role === "tenant") {
        //         filter.status = { $ne: "Occupied" }
        //     } else if (req.user && req.user.role === "owner") {
        //         filter.ownerId = req.user._id;
        //     }
        // }
    },
    getById: {
    populate: ['propertyId'],
}
});


// Custom method to get rooms by property
RoomController.getByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const filter = { propertyId };

        if (req.user && req.user.role === 'tenant') {
            filter.status = { $ne: 'Occupied' };
        } else if (req.user && req.user.role === 'owner') {
            filter.ownerId = req.user._id;
        }

        const rooms = await Room.find(filter);
        const count = await Room.countDocuments(filter);

        return res.status(200).json({
            message: 'Rooms fetched successfully',
            data: rooms,
            count: count
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: 'Server error'
        });
    }

}


const adminRoomController = new BaseController(Room, {
    name: 'Room',
 
    get: {
        pagination: config.pagination,
        populate: ['propertyId'],
        query: ["propertyId"],
        // pre: async (filter, req, res) => {
        //     if (req.user && req.user.role === "tenant") {
        //         filter.status = { $ne: "Occupied" }
        //     } else if (req.user && req.user.role === "owner") {
        //         filter.ownerId = req.user._id;
        //     }
        // }
    },
    getById: {
    populate: ['propertyId'],
}
});


module.exports = {RoomController,adminRoomController};
