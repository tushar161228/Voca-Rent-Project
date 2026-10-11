"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  CreditCard,
  IndianRupee,
  Activity,
} from "lucide-react";

import Heading from "@/components/atoms/Heading";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { fetchdashboard } from "@/components/redux/slice/dashboard-slice";


const MainDashboard = () => {
  const dispatch = useDispatch();

  const { dashboarddata } = useSelector(
    (state) => state.dashboard
  );

  const stats = [
    {
      title: `Total ${dashboarddata?.totalUsers <= 1 ? "Owner" : "Owners"}`,
      value: dashboarddata?.totalUsers || 0,
      icon: Users,
      gradient: "d-user-card",
    },
    {
      title: `Total ${dashboarddata?.totalTenant <= 1 ? "Customer" : "Customers"}`,
      value: dashboarddata?.totalTenant || 0,
      icon: Users,
      gradient: "d-customer-card ",
    },
    {
      title: `Total ${dashboarddata?.totalSubscriptions <= 1 ? "Subscription" : "Subscriptions"}`,
      value: dashboarddata?.totalSubscriptions || 0,
      icon: CreditCard,
      gradient: "d-runing-card",
    },
    {
      title: `Total ${dashboarddata?.activeSubscriptions <= 1 ? "Subscription" : "Subscriptions"}`,
      value: dashboarddata?.activeSubscriptions || 0,
      icon: Activity,
      gradient: "d-trades-card",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboarddata?.totalRevenue || 0}`,
      icon: IndianRupee,
      gradient: " d-wallet-card",
    },
  ];

  useEffect(() => {
    dispatch(fetchdashboard());
  }, [dispatch]);

  return (
    <div>
      <Heading
        title="Dashboard"
        paragraph="Overview of platform stats"
      />

      <div className="grid gap-4 lg:gap-5 xl:gap-6 mt-5  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-4 xl:p-5 text-white ${item.gradient}`}
            >
              {/* Overlay */}
              <div className="absolute inset-0 d-overlay-card pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl d-icon-bg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Background Circle */}
              <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-white opacity-10"></div>
            </div>
          );
        })}
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default MainDashboard;