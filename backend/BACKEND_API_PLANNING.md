# Property / Rent Management Backend API Planning

## 1. Project Summary

This backend is a Node.js + Express.js + MongoDB API for a Property / Rent Management application. It manages owners, tenants, properties, rooms, leases, rents, payments, notifications, subscriptions, settings, reminders, and dashboard analytics.

Current project structure already includes:

- `core/AuthController.js`: JWT auth, role authorization, register/login/OTP/profile/password flows.
- `core/BaseController.js`: reusable CRUD controller with pagination, populate, select, hooks, and optional user-level access.
- `core/Database.js`: MongoDB connection utility.
- `config.js`: environment-driven app, database, JWT, pagination, and Cloudinary config.
- `SmartReminderEngine.js`: cron-based rent generation and reminder job.
- `models/`: User, Property, Room, Lease, Rent, Payment, Notification, Subscription, Settings, MaintenanceFlag.
- `routes/`: AuthRoutes, OwnerRoutes, TenantRoutes.

All API responses should follow this structure for success and failure:

```json
{
  "message": "Human readable message",
  "data": {},
  "error": null
}
```

For list APIs, `count` may be included:

```json
{
  "message": "Fetched successfully",
  "data": [],
  "count": 0,
  "error": null
}
```

## 2. Environment And Config Plan

### Required `.env`

```env
PORT=8080
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:27017/rent_management
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

WHATSAPP_API_KEY=
WHATSAPP_SENDER_ID=
IVR_API_KEY=
PAYMENT_GATEWAY_KEY=
PAYMENT_GATEWAY_SECRET=
```

### `config.js` additions recommended

```js
module.exports = {
  database: {
    dbConnectionString: process.env.MONGODB_CONNECTION_STRING,
  },
  http: {
    port: process.env.PORT || 8080,
  },
  pagination: {
    limit: 10,
    maxLimit: 500,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  subscriptionTiers: {
    basic: {
      price: 1,
      maxTenants: 10,
      whatsappAlerts: 0,
      ivrCalls: 0,
      features: ["Manual rent tracking", "Transaction history", "Basic analytics"],
    },
    standard: {
      price: 99,
      maxTenants: 20,
      whatsappAlerts: 10,
      ivrCalls: 5,
      features: ["Payment reminders", "Advanced analytics"],
    },
    premium: {
      price: 249,
      maxTenants: 50,
      whatsappAlerts: 30,
      ivrCalls: 15,
      features: ["Automated reminders", "Premium analytics", "Priority support"],
    },
    enterprise: {
      price: 499,
      maxTenants: 100,
      whatsappAlerts: -1,
      ivrCalls: -1,
      features: ["Full automation", "24/7 support", "Custom integrations"],
    },
  },
  reminderSettings: {
    startBeforeDays: 3,
    schedule: [
      { day: -3, alerts: 2, ivrCalls: 0 },
      { day: -2, alerts: 3, ivrCalls: 0 },
      { day: -1, alerts: 4, ivrCalls: 2 },
    ],
  },
};
```

## 3. Core Folder Strategy

### AuthController

Use one shared `Auth` instance from `controllers/Auth.js`.

Responsibilities:

- `register`
- `login`
- `sendOtp`
- `verifyOtp`
- `forgotPassword`
- `resetPassword`
- `getUser`
- `updateUser`
- `authenticateToken`
- `authorizeRole`

Middleware usage:

```js
router.use(Auth.authenticateToken);
router.use(Auth.authorizeRole("Owner"));
```

After `authenticateToken`, `req.user` should contain the full user document, including `_id`, `name`, `mobile`, `email`, `role`, `subscriptionTier`, and verification/block status.

### BaseController

Use for common CRUD models:

- Property
- Room
- Lease
- Rent
- Payment
- Notification
- Subscription
- Settings
- MaintenanceFlag

Important config patterns:

```js
new BaseController(Model, {
  name: "Property",
  access: "user",
  accessKey: "ownerId",
  get: {
    pagination: config.pagination,
    query: ["status"],
    populate: [{ path: "ownerId", select: "name mobile" }],
  },
});
```

### Database

Use `core/Database.js` from `index.js` instead of directly using `mongoose.connect`, so DB connection behavior stays centralized.

## 4. Models Plan

### User / Auth Model

Used for both owners and tenants.

Fields:

- `name`
- `email`
- `mobile`
- `password`
- `avatar`
- `role`: `Owner`, `Tenant`
- `isVerified`
- `isBlocked`
- `otp[]`
- `subscriptionTier`
- `subscriptionExpiry`

Recommended additions:

- `ownerId` for tenant records created by an owner.
- `address`
- `profileCompleted`
- `lastLoginAt`

### Property Model

Fields:

- `name`
- `address`
- `ownerId`
- `description`
- `images[]`

### Room Model

Fields:

- `roomNumber`
- `monthlyRent`
- `propertyId`
- `status`: `Available`, `Occupied`
- `amenities[]`
- `description`

Recommended additions:

- `ownerId` denormalized for simpler access filtering.
- `floor`
- `roomType`

### Tenant Model

Tenant is currently represented by `User` with `role: "Tenant"`.

Recommended tenant-specific fields can stay in `User` or move to `TenantProfile`:

- `ownerId`
- `roomId`
- `propertyId`
- `emergencyContact`
- `documentUrls[]`

### Lease / Agreement Model

Fields:

- `tenantId`
- `roomId`
- `ownerId`
- `startDate`
- `endDate`
- `rentAmount`
- `deposit`
- `status`: `Active`, `Expired`, `Terminated`
- `agreementUrl`

Recommended additions:

- `acceptedByTenant`
- `acceptedAt`
- `terms`
- `dueDay`

### Rent Model

Fields:

- `leaseId`
- `tenantId`
- `roomId`
- `month`
- `year`
- `dueDate`
- `amount`
- `status`: `Pending`, `Paid`, `Overdue`, `Partially Paid`
- `paidAmount`
- `paymentDate`

### Payment Model

Fields:

- `tenantId`
- `roomId`
- `rentId`
- `amount`
- `paymentMethod`: `Cash`, `Online`, `UPI`, `Bank Transfer`
- `status`: `Pending`, `Completed`, `Failed`, `Refunded`
- `transactionId`
- `receiptUrl`
- `approvalStatus`: `Requested`, `Accepted`, `Rejected`
- `paymentDate`

Recommended additions:

- `ownerId`
- `gatewayOrderId`
- `gatewayPaymentId`
- `failureReason`

### Notification Model

Fields:

- `user`
- `title`
- `message`
- `type`: `WhatsApp`, `Maintenance`, `IVR`, `In-App`
- `status`: `Pending`, `Sent`, `Failed`
- `isRead`
- `readAt`
- `deliveredAt`

Recommended additions:

- `ownerId`
- `rentId`
- `channelResponse`
- `scheduledFor`

### Subscription Model

Fields:

- `title`
- `description`
- `price`
- `currency`
- `durationDays`
- `features.whatsappAlerts`
- `features.ivrCalls`
- `features.maxTenants`
- `features.analytics`
- `isActive`

Recommended additions:

- `tier`: `basic`, `standard`, `premium`, `enterprise`
- `automationEnabled`
- `prioritySupport`

### Settings Model

Fields:

- `ownerId`
- `reminderSettings.daysBeforeDue`
- `reminderSettings.whatsappEnabled`
- `reminderSettings.ivrEnabled`
- `reminderSettings.autoGenerateRent`
- `reminderSettings.rentGenerationDay`
- `paymentSettings.upiId`
- `paymentSettings.bankDetails`

Recommended reminder shape:

```js
reminderSettings: {
  startBeforeDays: 3,
  schedule: [
    { day: -3, alerts: 2, ivrCalls: 0 },
    { day: -2, alerts: 3, ivrCalls: 0 },
    { day: -1, alerts: 4, ivrCalls: 2 },
  ],
}
```

## 5. Middleware Strategy

### Global middleware

- `cors()`
- `express.json()`
- `express.urlencoded({ extended: true })`
- maintenance middleware for login/tenant routes
- global error handler

### Auth middleware

```js
router.use(Auth.authenticateToken);
```

Validates Bearer token, loads user from DB, blocks inactive/blocked users, and assigns full user document to `req.user`.

### Role middleware

```js
router.use(Auth.authorizeRole("Owner"));
router.use(Auth.authorizeRole("Tenant"));
```

### Ownership middleware / BaseController access

Owner-owned records should be filtered by `req.user._id`. Recommended pattern:

- Property: `access: "user"`, `accessKey: "ownerId"`
- Lease: `access: "user"`, `accessKey: "ownerId"`
- Settings: `access: "user"`, `accessKey: "ownerId"`
- Tenant-side Rent: `access: "user"`, `accessKey: "tenantId"`
- Tenant-side Payment: `access: "user"`, `accessKey: "tenantId"`
- Tenant-side Notification: custom filter `user: req.user._id`

## 6. Route Structure

Base format:

```txt
/api/auth/[operation]
/api/owner/[operation]
/api/tenant/[operation]
```

Protected routes:

```txt
Authorization: Bearer <jwt>
```

## 7. API Documentation

### Auth Routes

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/auth/register` | `name,email,mobile,password,avatar,role` | `201 { message, data: user }` | `400 mobile required/user exists`, `500 server error` |
| POST | `/api/auth/send-otp` | `mobile` | `200 { message, data: null }` | `404 user not found`, `429 OTP limit exceeded` |
| POST | `/api/auth/verify-otp` | `mobile,otp` | `200 { message, data: null }` | `400 invalid OTP`, `404 user not found` |
| POST | `/api/auth/login` | `mobile,password` | `200 { message, data: { user, token } }` | `401 invalid password/not verified/blocked` |
| POST | `/api/auth/forgot-password` | `mobile` | `200 { message }` | `404 user not found` |
| POST | `/api/auth/reset-password` | `mobile,otp,password` | `200 { message, data: user }` | `400 invalid OTP`, `404 user not found` |
| GET | `/api/auth/profile` | none | `200 { message, data: user }` | `401 unauthorized` |
| PUT | `/api/auth/profile` | profile fields, optional `currentPassword,password` | `200 { message, data: user }` | `400 restricted fields`, `401 invalid password` |

### Owner - Property

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/properties` | `name,address,description,images[]` | `201 { message, data }` | `400 validation`, `401/403 auth`, `500` |
| GET | `/api/owner/properties` | query: `page,limit,search` | `200 { message, data, count }` | `401/403`, `500` |
| GET | `/api/owner/properties/:id` | none | `200 { message, data }` | `404 not found` |
| PUT | `/api/owner/properties/:id` | property fields | `200 { message, data }` | `404 not found` |
| DELETE | `/api/owner/properties/:id` | none | `200 { message, data }` | `404 not found` |

### Owner - Room

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/rooms` | `roomNumber,monthlyRent,propertyId,status,amenities[],description` | `201 { message, data }` | `400 validation` |
| GET | `/api/owner/rooms` | query: `propertyId,status,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/rooms/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/owner/properties/:propertyId/rooms` | none | `200 { message, data, count }` | `404/500` |
| PUT | `/api/owner/rooms/:id` | room fields | `200 { message, data }` | `404` |
| DELETE | `/api/owner/rooms/:id` | none | `200 { message, data }` | `404` |

### Owner - Tenant

Recommended routes to add. Tenants are `User` documents with `role: "Tenant"`.

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/tenants` | `name,email,mobile,password,avatar` | `201 { message, data }` | `400 user exists` |
| GET | `/api/owner/tenants` | query: `page,limit,search` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/tenants/:id` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/tenants/:id` | tenant profile fields | `200 { message, data }` | `400 restricted fields` |
| DELETE | `/api/owner/tenants/:id` | none | `200 { message, data }` | `404` |

### Owner - Lease / Agreement

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/leases` | `tenantId,roomId,startDate,endDate,rentAmount,deposit,agreementUrl` | `201 { message, data }` | `400 validation/room occupied` |
| GET | `/api/owner/leases` | query: `status,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/leases/:id` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/leases/:id` | lease fields | `200 { message, data }` | `404` |
| DELETE | `/api/owner/leases/:id` | none | `200 { message, data }` | `404` |
| PATCH | `/api/tenant/leases/:id/confirm` | none | `200 { message, data }` | `403/404` |

Lease create post-action:

- Mark room as `Occupied`.
- Generate current month rent if needed.
- Send tenant notification.

### Owner - Rent

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/rents` | `leaseId,tenantId,roomId,month,year,dueDate,amount` | `201 { message, data }` | `400 duplicate/validation` |
| GET | `/api/owner/rents` | query: `status,roomId,tenantId,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/rents/:id` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/rents/:id` | rent fields | `200 { message, data }` | `404` |
| DELETE | `/api/owner/rents/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/owner/rents-cards` | none | `200 { message, data }` | `500` |

### Owner - Payments

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/payments` | `tenantId,roomId,rentId,amount,paymentMethod,transactionId` | `201 { message, data }` | `400 validation` |
| GET | `/api/owner/payments` | query: `approvalStatus,status,page,limit` | `200 { message, data, count }` | `500` |
| PATCH | `/api/owner/payments/approve/:id` | optional `status: Accepted/Rejected` | `200 { message, data }` | `404 payment not found` |
| GET | `/api/owner/payments/reports` | query: `dateFrom,dateTo,propertyId,tenantId` | `200 { message, data }` | `500` |
| GET | `/api/owner/payments/pending-rent` | query filters | `200 { message, data }` | `500` |

Approval behavior:

- Set payment `approvalStatus = Accepted`.
- Set payment `status = Completed`.
- Update rent `status = Paid`, `paidAmount`, `paymentDate`.
- Send payment success notification.
- Refresh dashboard values automatically through DB state.

### Owner - Notifications

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/notification` | `user,title,message,type` | `201 { message, data }` | `400 validation` |
| GET | `/api/owner/notification` | query: `type,status,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/notification/:id` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/notification/:id` | notification fields | `200 { message, data }` | `404` |
| DELETE | `/api/owner/notification/:id` | none | `200 { message, data }` | `404` |
| POST | `/api/owner/notification/reminder` | `tenantId,rentId,channels[]` | `200 { message, data }` | `400 quota exceeded` |

### Owner - Subscription

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/owner/subscription` | `title,description,price,currency,durationDays,features,isActive` | `201 { message, data }` | `400 validation` |
| GET | `/api/owner/subscription` | query: `isActive,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/owner/subscription/:id` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/subscription/:id` | subscription fields | `200 { message, data }` | `404` |
| DELETE | `/api/owner/subscription/:id` | none | `200 { message, data }` | `404` |
| POST | `/api/owner/subscription/purchase` | `subscriptionId` | `200 { message, data }` | `400 payment failed` |

### Owner - Settings

Recommended routes to add.

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/owner/settings` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/settings` | `reminderSettings,paymentSettings` | `200 { message, data }` | `400 validation` |
| GET | `/api/owner/settings/reminders` | none | `200 { message, data }` | `404` |
| PUT | `/api/owner/settings/reminders` | `startBeforeDays,schedule` | `200 { message, data }` | `400 validation` |

### Owner - Dashboard

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/owner/property-cards` | none | `200 { message, data }` | `500` |
| GET | `/api/owner/rooms-cards/:propertyId` | none | `200 { message, data }` | `500` |
| GET | `/api/owner/rents-dashboard` | none | `200 { message, data }` | `500` |
| GET | `/api/owner/performance-chart` | none | `200 { message, data }` | `500` |
| GET | `/api/owner/monthly-dashboard` | none | `200 { message, data }` | `500` |
| GET | `/api/owner/overview-cards` | none | `200 { message, data }` | `500` |

Dashboard data:

- Total properties
- Total rooms
- Occupied/vacant rooms
- Total tenants
- Total rent collected
- Pending rent
- Overdue rent
- Monthly collection chart
- Property performance

### Tenant - Property And Room

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/tenant/properties` | query: `page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/tenant/properties/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/room` | query: `propertyId` | `200 { message, data, count }` | `500` |
| GET | `/api/tenant/room/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/properties/:propertyId/rooms` | none | `200 { message, data, count }` | `500` |

Tenant room list should show available rooms only unless viewing the tenant's assigned room.

### Tenant - Lease

Recommended routes to add.

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/tenant/leases` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/leases/:id` | none | `200 { message, data }` | `404` |
| PATCH | `/api/tenant/leases/:id/confirm` | none | `200 { message, data }` | `403/404` |

### Tenant - Rent

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/tenant/rents` | query: `status,page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/tenant/rents/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/my-rent` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/due-rent` | none | `200 { message, data }` | `404` |

### Tenant - Payment

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| POST | `/api/tenant/pay-rent` | `rentId,amount,paymentMethod,transactionId` | `201 { message, data }` | `400 validation/payment failed` |
| POST | `/api/tenant/pay-rent/create-order` | `rentId,amount` | `200 { message, data: order }` | `400 gateway error` |
| POST | `/api/tenant/pay-rent/verify` | `orderId,paymentId,signature` | `200 { message, data }` | `400 invalid payment` |
| GET | `/api/tenant/payments` | query: `page,limit,status` | `200 { message, data, count }` | `500` |

### Tenant - Notifications

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/tenant/notification` | query: `page,limit` | `200 { message, data, count }` | `500` |
| GET | `/api/tenant/notification/:id` | none | `200 { message, data }` | `404` |
| PATCH | `/api/tenant/notification/mark-all-read` | none | `200 { message, data }` | `500` |

### Tenant - Subscription And Settings

| Method | URL | Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/tenant/subscription` | none | `200 { message, data, count }` | `500` |
| GET | `/api/tenant/subscription/:id` | none | `200 { message, data }` | `404` |
| GET | `/api/tenant/settings` | none | `200 { message, data }` | `404` |

## 8. Owner Complete Flow

1. Owner registers with `name`, `email`, `mobile`, `password`, `avatar`, `role`.
2. Owner verifies OTP.
3. Owner logs in with mobile/password and receives JWT.
4. Owner updates profile.
5. Owner creates property using `name`, `address`.
6. Owner creates rooms using `roomNumber`, `monthlyRent`, `propertyId`.
7. Owner creates subscription plans or purchases a plan.
8. Owner creates tenant records.
9. Owner creates lease with `tenantId`, `roomId`, `startDate`, `endDate`, `rentAmount`, `deposit`.
10. Room becomes occupied after lease confirmation/activation.
11. Monthly rent records are generated.
12. Smart reminder engine sends reminders before due date.
13. Tenant pays rent.
14. Owner approves payment request.
15. Rent/payment status updates.
16. Dashboard shows collection, pending rent, properties, rooms, and tenants.
17. Owner can send manual notifications.

## 9. Tenant Complete Flow

1. Tenant registers with `name`, `email`, `mobile`, `password`, `avatar`.
2. Tenant verifies OTP.
3. Tenant logs in and receives JWT.
4. Tenant updates profile.
5. Tenant views properties and available rooms.
6. Owner assigns room through lease.
7. Tenant views lease/agreement.
8. Tenant views current rent and due rent.
9. Tenant creates rent payment order.
10. Tenant pays rent.
11. Tenant views payment history.
12. Tenant receives WhatsApp, IVR, push, or in-app notifications.

## 10. Smart Reminder Engine Plan

Default rule:

```js
dueDate = "5 April"
2 April => 2 WhatsApp alerts
3 April => 3 WhatsApp alerts
4 April => 4 WhatsApp alerts + 2 IVR calls
```

Processing steps:

1. Run daily cron.
2. Find pending rents where due date is within configured reminder window.
3. Load owner settings and subscription quota.
4. Check WhatsApp/IVR quota.
5. Create notification logs.
6. Dispatch WhatsApp and IVR through external provider.
7. Mark notification `Sent` or `Failed`.
8. If due date passed, mark rent as `Overdue`.

Monthly rent generation:

1. Run on configured rent generation day.
2. Find active leases.
3. Create one rent per `leaseId + month + year`.
4. Assign `tenantId`, `roomId`, `dueDate`, and `amount`.

## 11. Current Implementation Gaps To Fix

These are the main gaps found while reviewing `core/`, `config.js`, routes, controllers, and models:

1. `OwnerRoutes.js` has `router.get('/properties/:id', propertyController.deleteById);`; this must be `router.delete('/properties/:id', propertyController.deleteById);`.
2. `AuthController.generateToken()` logs JWT secret. Remove `console.log(this.secret)`.
3. `AuthController.updateUser()` uses `req.user?.id`; current auth attaches a Mongoose user with `_id`. Use `req.user?._id`.
4. `otpLogin()` currently does not verify OTP because the OTP validation block is commented.
5. OTP expiry is configured but not checked in `verifyOtp()` and `resetPassword()`.
6. `BaseController` access only checks `access === "user"`; configs like `access: "Owner"` do nothing.
7. Property controller currently has owner access commented out. It should filter by `ownerId`.
8. Room model lacks `ownerId`, so owner filtering requires joining property or adding denormalized `ownerId`.
9. Lease model lacks `propertyId`, but dashboard code queries `Lease.find({ propertyId })`. Either add `propertyId` or derive through room IDs.
10. `SmartReminderEngine.generateMonthlyRents()` creates Rent without required `roomId`.
11. `SmartReminderEngine.processReminders()` creates notification with `userId`, but Notification schema field is `user`.
12. Notification controller populate uses `userId`, but schema field is `user`.
13. Dashboard APIs need stricter owner scoping for payments, rents, rooms, and tenants.
14. Settings model exists but no controller/routes are wired.
15. Owner tenant CRUD routes are missing.
16. Tenant lease routes are missing.
17. Payment create-order and verify-payment routes are missing for real gateway integration.
18. Response shape is inconsistent in some controllers (`success` appears sometimes, `data` missing sometimes).
19. Maintenance middleware returns `success` instead of the required `{ message, data, error }` shape.
20. Subscription purchase logic and quota tracking are not implemented yet.

## 12. Recommended Route Files

```txt
routes/
  AuthRoutes.js
  OwnerRoutes.js
  TenantRoutes.js
```

Optional split for maintainability:

```txt
routes/owner/
  property.routes.js
  room.routes.js
  tenant.routes.js
  lease.routes.js
  rent.routes.js
  payment.routes.js
  notification.routes.js
  subscription.routes.js
  settings.routes.js
  dashboard.routes.js

routes/tenant/
  property.routes.js
  room.routes.js
  lease.routes.js
  rent.routes.js
  payment.routes.js
  notification.routes.js
  subscription.routes.js
  settings.routes.js
```

## 13. Implementation Priority

1. Normalize response format across all controllers.
2. Fix auth bugs: secret logging, `_id`, OTP verify, OTP expiry.
3. Fix route typo for property delete.
4. Add owner scoping to properties, rooms, leases, rents, payments, dashboard.
5. Add settings controller/routes.
6. Add tenant CRUD controller/routes for owners.
7. Add tenant lease/my-rent/due-rent routes.
8. Fix SmartReminderEngine schema mismatches.
9. Add subscription purchase and quota tracking.
10. Add payment gateway order/verify flow.
11. Add report APIs.
12. Add validation middleware for request bodies.

## 14. Suggested Final Backend Behavior

The completed backend should support:

- Owner and tenant registration/login with OTP verification.
- Role-protected APIs using the shared core Auth instance.
- Owner CRUD for properties, rooms, tenants, leases, rents, subscriptions, notifications, and settings.
- Tenant read access for assigned lease, room, rent, payments, notifications, subscriptions, and settings.
- Rent generation and reminder automation.
- WhatsApp and IVR quota management by subscription tier.
- Payment request, approval, and dashboard update flow.
- Consistent API response shape for every success and error.

