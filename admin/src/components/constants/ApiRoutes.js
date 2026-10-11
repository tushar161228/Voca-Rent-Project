export const getApiRoutes = () => {
  return {
    AUTH_SIGNIN: "/api/auth/login",
    SEND_OTP: "/api/auth/otp",
    REGISTER: "/api/auth/register",
    VERIFY_OTP: "/api/auth/verify",
    CUSTOMERS: "/api/admin/tenant",
    CUSTOMER_DASHBOARD: "/api/admin/tenant-dashboard",
    OWNER_ADMIN: "/api/admin/user",
    RENTS: "/api/admin/rents",
    RENTS_DASHBOARD: "/api/admin/rents-cards",
    PAYMENT: "/api/admin/payments",
    PAYMENT_DASHBOARD: "/api/admin/payment-dashboard",
    PROPERTIES: "/api/admin/properties",
    PROPERTIES_DASHBOARD: "/api/admin/property-cards",
    SUBSCRIPTIONS: "/api/admin/subscription",
    DASHBOARD: "/api/admin/dashboard-stats",
    PAYMENT_GRAPH: "/api/admin/payment-graph",
    PLAN_DISTRIBUTION: "/api/admin/subscription-dashboard",
  };
};