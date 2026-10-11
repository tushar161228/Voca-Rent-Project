const MaintenanceFlag = require('../models/MaintenanceFlag');
const User = require('../models/User');

const maintenanceLoginGuard = async (req, res, next) => {
  try {
    const flag = await MaintenanceFlag.findOne({ enabled: true });
 
    if (flag && req.body && req.body.mobile) {
      const isOwner = await User.findOne({ mobile: req.body.mobile, role: 'Owner' }).select('_id').lean();
      if (isOwner) return next();
    }

    if (!flag) return next();

    const maintenanceStartTime = new Date(flag.updatedAt).getTime();
    const durationInMs = (flag.time || 0) * 60 * 1000;
    const maintenanceEndTime = maintenanceStartTime + durationInMs;
    const now = Date.now();

    if (now >= maintenanceEndTime) {
      await MaintenanceFlag.updateOne({ _id: flag._id }, { enabled: false });
      return next();
    }

    const remainingMinutes = Math.ceil((maintenanceEndTime - now) / (60 * 1000));

    return res.status(503).json({
      success: false,
      message: `System is under maintenance. Please try again after ${remainingMinutes} minutes.`
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Maintenance check failed',
      error: err.message
    });
  }
};

module.exports = maintenanceLoginGuard;