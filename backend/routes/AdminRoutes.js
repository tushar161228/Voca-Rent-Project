const express = require('express');
const router = express.Router();
const Auth = require('../controllers/Auth');

const {adminPropertyController} = require('../controllers/PropertyController');
const {adminRoomController,RoomController} = require('../controllers/RoomController');
const leaseController = require('../controllers/LeaseController');
const {adminRentController} = require('../controllers/RentController');
const {ownerPaymentController,adminPaymentController} = require('../controllers/PaymentController');
const dashboardController = require('../controllers/DashboardController');
const {adminSubscriptionController}=require("../controllers/subscriptions");
const maintenanceFlagController = require('../controllers/MaintenanceFlagController');
const notificationController = require('../controllers/NotificationController');
const { adminTenantController } = require('../controllers/TenantsController');
const userController = require('../controllers/UserController');


router.use(Auth.authenticateToken);   
router.use(Auth.authorizeRole('admin')); 

// Properties
router.post('/properties', adminPropertyController.create);
router.get('/properties', adminPropertyController.get);
router.get('/properties/:id', adminPropertyController.getById);
router.put('/properties/:id', adminPropertyController.updateById);
router.delete('/properties/:id', adminPropertyController.deleteById);


// Rooms
router.get('/rooms', adminRoomController.get);
router.get('/rooms/:id', adminRoomController.getById);
router.get('/properties/:propertyId/rooms',RoomController.getByProperty);

// Leases
router.get('/leases', leaseController.get);
router.post('/leases', leaseController.create);
router.get('/leases/:id', leaseController.getById);
router.put('/leases/:id', leaseController.updateById);
router.delete('/leases/:id', leaseController.deleteById);

// Rents
router.post('/rents', adminRentController.create);
router.get('/rents', adminRentController.get);
router.get('/rents/:id', adminRentController.getById);
router.put('/rents/:id', adminRentController.updateById);
router.delete('/rents/:id', adminRentController.deleteById);
router.get('/rents-cards', dashboardController.adminRentDashboard); 
// router.get('/rents-cards', adminRentController.adminRentDashboard); 

// Payments
router.post('/payments', ownerPaymentController.create);
router.patch('/payments/approve/:id', ownerPaymentController.approvePayment);
router.get('/payments', adminPaymentController.get);
router.get('/payments/:id', adminPaymentController.getById);
router.get('/payment-dashboard', adminPaymentController.paymentDashboard);


// Dashboard
// router.get('/property-cards', dashboardController.getOwnerStats);
router.get('/rooms-cards/:propertyId', dashboardController.getRoomsDashboard);         
router.get('/rents-dashboard', dashboardController.getRentDashboard);   
router.get('/performance-chart', dashboardController.getPerformanceChart);   
router.get('/monthly-dashboard', dashboardController.getMonthlyDashboard);
router.get('/property-cards', dashboardController.getAdminPropertyCards);
router.get('/dashboard-stats', dashboardController.getDashboardStats);
router.get('/payment-graph', dashboardController.getPaymentGraph);
router.get('/subscription-dashboard', dashboardController.subscriptionDashboard);


//SubscriptionController
router.post("/subscription",adminSubscriptionController.create)
router.get("/subscription",adminSubscriptionController.get)
router.get("/subscription/:id",adminSubscriptionController.getById)
router.put("/subscription/:id",adminSubscriptionController.updateById)
router.delete("/subscription/:id",adminSubscriptionController.deleteById)

router.get("/overview-cards", dashboardController.getOverviewCards)

//maintenance controller
router.post("/maintenance", maintenanceFlagController.create)
router.get("/maintenance", maintenanceFlagController.get)
router.put("/maintenance/:id", maintenanceFlagController.updateById)
router.delete("/maintenance/:id", maintenanceFlagController.deleteById)


//notification route
router.post("/notification",notificationController.create)
router.get("/notification",notificationController.get)
router.get("/notification/:id",notificationController.getById)
router.put("/notification/:id",notificationController.updateById)
router.delete("/notification/:id",notificationController.deleteById)

router.get("/tenant",adminTenantController.get)
router.get("/tenant/:id",adminTenantController.getById)

router.get("/user",userController.get)
router.get("/user/:id",userController.getById)
router.put("/user/:id",userController.updateById)
router.post("/user",userController.create)


module.exports = router;
