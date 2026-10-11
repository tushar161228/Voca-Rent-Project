"use client";

import React, { useEffect, useState } from "react";

import {
  fetchPaymentGraph,
  fetchPlandistribution,
} from "@/components/redux/slice/dashboard-slice";

import { useDispatch, useSelector } from "react-redux";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#06b6d4",
  "#94a3b8",
  "#f59e0b",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(currentDate.getMonth() + 1);

  const [selectedYear, setSelectedYear] =
    useState(currentDate.getFullYear());

  const [showAllPlans, setShowAllPlans] =
    useState(false);

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - i
  );

  const {
    planDistributionData,
    paymentGraphData,
  } = useSelector((s) => s.dashboard);

  // FETCH PLAN DISTRIBUTION

  useEffect(() => {
    dispatch(fetchPlandistribution());
  }, [dispatch]);

  // FETCH PAYMENT GRAPH

  useEffect(() => {
    dispatch(
      fetchPaymentGraph({
        filters: {
          year: selectedYear,
        },
      })
    );
  }, [dispatch, selectedMonth, selectedYear]);

  // PLAN DATA

  const totalUsers =
    planDistributionData?.totalActiveUsers || 0;

  const planData =
    planDistributionData?.data?.map(
      (item, index) => ({
        name: item.planName,
        value: item.count,
        color:
          COLORS[index % COLORS.length],
      })
    ) || [];

  const visiblePlans = showAllPlans
    ? planData
    : planData.slice(0, 3);

  // PAYMENT GRAPH DATA

  const equityData = paymentGraphData
    ? Object.entries(paymentGraphData).map(
      ([date, values]) => ({
        name: date,
        Paid: values?.Paid || 0,
        Pending: values?.Pending || 0,
        Overdue: values?.Overdue || 0,
        PartiallyPaid:
          values?.PartiallyPaid || 0,
      })
    )
    : [];

  return (
    <div className="mt-5 md:mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* PAYMENT GRAPH */}

        <div className="lg:col-span-2 create-s-border p-6 rounded-lg md:rounded-xl lg:rounded-2xl h-fit">

          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Payment Graph
              </h3>

              <p className="text-[0.85rem] text-gray-500">
                {new Date(
                  selectedYear,
                  selectedMonth - 1
                ).toLocaleDateString(
                  "en-IN",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}{" "}
                payment overview
              </p>
            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap items-center gap-3">

              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(e.target.value)
                  )
                }
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer text-slate-800"
              >
                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>

              {/* RESET */}

              <button
                onClick={() => {
                  setSelectedMonth(
                    currentDate.getMonth() + 1
                  );

                  setSelectedYear(
                    currentDate.getFullYear()
                  );
                }}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer text-slate-800"
              >
                Reset
              </button>
            </div>
          </div>

          {/* CHART */}

          <div className="h-[320px] w-full">

            {equityData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={equityData}>

                  <defs>

                    <linearGradient
                      id="paidGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis />
                  <Tooltip />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="Paid"
                    stroke="#2563eb"
                    fill="url(#paidGradient)"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="Pending"
                    stroke="#f59e0b"
                    fillOpacity={0}
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="Overdue"
                    stroke="#ef4444"
                    fillOpacity={0}
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="PartiallyPaid"
                    stroke="#8b5cf6"
                    fillOpacity={0}
                    strokeWidth={2}
                  />

                </AreaChart>
              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No payment data found
              </div>

            )}

          </div>
        </div>

        {/* PLAN DISTRIBUTION */}

        <div className="create-s-border p-6 rounded-lg md:rounded-xl lg:rounded-2xl flex flex-col">

          <div className="mb-4">

            <h3 className="text-lg font-bold text-slate-800">
              Plan Distribution
            </h3>

            <p className="text-[0.85rem] text-gray-500">
              Total Active Users :{" "}
              {totalUsers}
            </p>

          </div>

          {/* PIE CHART */}

          <div className="h-[220px] relative">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={planData}
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {planData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                        cornerRadius={6}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

          {/* PLAN LIST */}

          <div className="mt-3 space-y-2">

            {visiblePlans.map(
              (item, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center"
                >

                  <div className="flex items-center gap-2">

                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span className="text-[0.82rem] text-slate-700">
                      {item.name}
                    </span>

                  </div>

                  <span className="font-semibold text-slate-800 text-[0.82rem]">
                    {item.value}
                  </span>

                </div>
              )
            )}

            {planData.length > 3 && (

              <button
                onClick={() =>
                  setShowAllPlans(
                    !showAllPlans
                  )
                }
                className="text-blue-600 text-[0.82rem] font-semibold cursor-pointer mt-1"
              >
                {showAllPlans
                  ? "View Less"
                  : "View More"}
              </button>

            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;