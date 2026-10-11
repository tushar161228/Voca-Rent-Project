const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');

const {RentController} = require('../controllers/RentController');
const {PaymentController} = require('../controllers/PaymentController');
const {SubscriptionController} = require('../controllers/subscriptions');
const {PropertyController}=require("../controllers/PropertyController");
const RoomController = require('../controllers/RoomController');
const maintenanceFlagController = require('../controllers/MaintenanceFlagController');
const notificationController = require('../controllers/NotificationController');
const leaseController = require('../controllers/LeaseController');



// Middleware for Tenant access
// const tenantAuth = [auth.authenticateToken, auth.authorizeRole('Tenant')];

router.use(auth.authenticateToken);
router.use(auth.authorizeRole("tenant"));

//property route
router.get('/properties', PropertyController.get);
router.get('/properties/:id', PropertyController.getById);

//room route
router.get('/room',RoomController.get);
router.get('/room/:id',RoomController.getById);
router.get('/properties/:propertyId/rooms', RoomController.getByProperty);

// Rents
router.get('/rents', RentController.get);
router.get('/due-rent', RentController.getDueRent);
router.get('/rents/:id', RentController.getById);

// Leases
router.get('/leases', leaseController.get);
router.get('/leases/:id', leaseController.getById);

// Payments
router.post('/pay-rent', PaymentController.create);
router.get('/payments', PaymentController.get);


//SubscriptionController route
router.get("/subscription",SubscriptionController.get)
router.get("/subscription/:id",SubscriptionController.getById)

//notification route
router.get("/notification",notificationController.getNotifications)
router.patch("/notification/mark-all-read",notificationController.markAllUserNotificationsRead)
router.get("/notification/:id",notificationController.getById)


module.exports = router;
