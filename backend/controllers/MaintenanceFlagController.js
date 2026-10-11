const BaseController = require('../core/BaseController');
const MaintenanceFlag = require('../models/MaintenanceFlag');
const Notification = require('../models/Notification');
const User = require('../models/User');


const maintenanceFlagController = new BaseController(MaintenanceFlag, {
  name: 'MaintenanceFlag',
  access: 'Owner',
  create: {
    pre: async (payload, req, res) => {
      payload.updatedBy = req.user._id;
      const flag = await MaintenanceFlag.findOne({
        enabled: true
      })
      if (flag) {
        return res.status(400).json({
          success: false,
          message: 'Maintenance already enabled.Please wait for it to end'
        })
      }
      const users = await User.find({ isVerified: true, isBlocked: false }).select('_id');
      const notifications = [];
      for (let user of users) {
        notifications.push({
          user: user._id,
          type: 'WhatsApp',
          title: 'Maintenance',
          // message: `We are currently undergoing maintenance. The service will be back in ${payload.time} minutes.`
          message: payload?.message || `We are currently undergoing maintenance. The service will be back in ${payload.time} minutes.Please plan accordingly.`
        })
      }
      await Notification.insertMany(notifications);
      await MaintenanceFlag.deleteMany({
        enabled: false
      });
    }
  }
});


module.exports = maintenanceFlagController;
