const BaseController = require("../core/BaseController")
const Tenant = require("../models/Tenants")
const mongoose = require('mongoose');
const config = require('../config');
const Rent = require("../models/Rent")

const TenantController = new BaseController(Tenant, {
    name: 'Tenant',
    access: "user",
    accessKey: "createdBy",
    get: {
        pagination: config.pagination,
        query : ["joinDate", "exitDate"],
        searchField: ['name', 'mobile', 'aadhar', 'email']
    },
});

const adminTenantController = new BaseController(Tenant, {
    name: 'Tenant',
    access: "admin",
    get: {
        pagination: config.pagination,
        query : ["joinDate", "exitDate"],
        searchField: ['name', 'mobile', 'aadhar',"email"],
        pre: async (filter, req, res) => {
            const propertyId = req.query.propertyId;
            if (!propertyId) return;
            const result = await Rent.aggregate([
                {
                    $lookup: {
                        from: 'rooms',
                        localField: 'roomId',
                        foreignField: '_id',
                        as: 'room'
                    }
                },
                { $unwind: '$room' },
                { $match: { 'room.propertyId': new mongoose.Types.ObjectId(propertyId) } },
                { $group: { _id: null, tenants: { $addToSet: '$tenantId' } } },
                { $project: { _id: 0, tenants: 1 } }
            ]);
            const tenantIds = (result[0] && result[0].tenants) ? result[0].tenants : [];
            filter['_id'] = { $in: tenantIds };
        }
    },
});



module.exports = { TenantController, adminTenantController };