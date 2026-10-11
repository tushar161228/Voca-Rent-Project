const express = require('express');
const router = express.Router();
const Auth=require("../controllers/Auth");

const { PropertyController } = require('../controllers/PropertyController');
const { RoomController } = require('../controllers/RoomController');
// const leaseController = require('../controllers/LeaseController');
const { ownerRentController } = require('../controllers/RentController');
const { ownerPaymentController } = require('../controllers/PaymentController');
const dashboardController = require('../controllers/DashboardController');
const { SubscriptionController, verifyPayment } = require("../controllers/subscriptions");
const maintenanceFlagController = require('../controllers/MaintenanceFlagController');
const notificationController = require('../controllers/NotificationController');
const { TenantController } = require('../controllers/TenantsController');


router.use(Auth.authenticateToken);
router.use(Auth.authorizeRole('owner'));

// Properties
router.post('/properties', PropertyController.create);
router.get('/properties', PropertyController.get);
router.get('/properties/:id', PropertyController.getById);
router.put('/properties/:id', PropertyController.updateById);
// router.delete('/properties/:id', PropertyController.deleteById);

// property dashboard
router.get('/property/dashboard', PropertyController.ownerPropertyDashboard);

// Rooms
router.post('/rooms', RoomController.create);
router.get('/rooms', RoomController.get);
router.get('/rooms/:id', RoomController.getById);
router.put('/rooms/:id', RoomController.updateById);
// router.delete('/rooms/:id', RoomController.deleteById);
router.get('/properties/:propertyId/rooms', PropertyController.getRoomByProperty);


// Leases
// router.get('/leases', leaseController.get);
// router.get('/leases/:id', leaseController.getById);

// Rents
router.post('/rents', ownerRentController.create);
router.get('/rents', ownerRentController.get);
router.get('/rents/:id', ownerRentController.getById);
router.get('/rents-cards', dashboardController.getRentCards);
router.get('/rents-dashboard', dashboardController.ownerRentDashboard);

// Payments
// router.post('/payments', ownerPaymentController.create);
// router.patch('/payments/approve/:id', ownerPaymentController.approvePayment);
router.get('/payments', ownerPaymentController.get);
router.get('/payments/:id', ownerPaymentController.getById);
router.get('/payment-dashboard', ownerPaymentController.ownerPaymentDashboard);


// Dashboard
router.get('/property-cards', dashboardController.getOwnerStats);
router.get('/rooms-cards/:propertyId', dashboardController.getRoomsDashboard);
router.get('/rents-dashboard', dashboardController.getRentDashboard);
// router.get('/performance-chart', dashboardController.getPerformanceChart);
// router.get('/monthly-dashboard', dashboardController.getMonthlyDashboard);
router.get("/overview-cards", dashboardController.getOverviewCards)
// router.get("/dashboard", dashboardController.ownerDasboard)    

router.get("/dashboard", dashboardController.appDasboard)    


//SubscriptionController
router.get("/subscription", SubscriptionController.get)
router.get("/subscription/:id", SubscriptionController.getById)
router.post("/subscription/purchase", SubscriptionController.purchaseSubscription)

//verify payment
router.post("/verify-payment", verifyPayment)

//maintenance controller
router.get("/maintenance", maintenanceFlagController.get)


//notification route
//router.post("/notification", notificationController.create)
router.get("/notification", notificationController.get)
router.get("/notification/:id", notificationController.getById)
//router.put("/notification/:id", notificationController.updateById)
router.delete("/notification/:id", notificationController.deleteById)

//activity route
router.get("/activity", notificationController.allSystemActivity)


//tenant routes
router.post("/tenant", TenantController.create)
router.get("/tenant", TenantController.get)
router.get("/tenant/:id", TenantController.getById)
router.put("/tenant/:id", TenantController.updateById)
router.delete("/tenant/:id", TenantController.deleteById)

module.exports = router;
