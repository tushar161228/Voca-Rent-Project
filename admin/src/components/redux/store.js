import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth-slice";
import sessionReducer from "./slice/session-slice";
import { injectStore } from "../utils/axiosInstance";
import customerReducer from "./slice/customer-slice";
import ownerAdminReducer from "./slice/ownerAdmin-slice";
import subscriptionReducer from "./slice/subscription-slice";
import dashboardReducer from "./slice/dashboard-slice";
import rentReducer from "./slice/rent-slice";
import paymentReducer from "./slice/payment-slice";
import propertyReducer from "./slice/property-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    customer: customerReducer,
    ownerAdmin: ownerAdminReducer,
    subscription: subscriptionReducer,
    dashboard: dashboardReducer,
    rent: rentReducer,
    payment: paymentReducer,
    property: propertyReducer,
  },
});

injectStore(store);
