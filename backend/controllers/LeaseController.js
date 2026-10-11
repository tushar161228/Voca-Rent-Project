const BaseController = require("../core/BaseController");
const Lease = require("../models/Lease");
const config = require("../config");

class LeaseController extends BaseController {
  constructor() {
    super(Lease, {
      name: "Lease",
      access: "user",
      accessKey: "ownerId",
      get: {
        pagination: config.pagination,
        populate: [{path:"tenantId",select:"name mobile"}, {path:"roomId"},{path:"ownerId",select:"name mobile"}],
      },
        getById: {
        populate: [{path:"tenantId",select:"name mobile"}, {path:"roomId"},{path:"ownerId",select:"name mobile"}],
      },
      // create: {
      //     pre: async (payload, req, res) => {
      //         // Logic to set room status to Occupied can be added in post hook or here
      //     }
      // }
    });
  }
}

module.exports = new LeaseController();
