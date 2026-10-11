"use client";

import React, { useEffect } from "react";
import BasicTable from "@/components/common/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchpayment, fetchpaymentdashboard } from "@/components/redux/slice/payment-slice";
import formatDatetime from "@/components/utils/formatDatetime";
import Badge from "@/components/common/Badge";
import Heading from "@/components/atoms/Heading";
import OverviewCard from "@/components/molecules/OverviewCard";
import { useRouter } from "next/navigation";
import SearchBox from "@/components/atoms/SearchBox";
import { useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useToggleQueryParam } from "@/components/utils/toggleQueryParam";


const MainPayments = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toggleQueryParam = useToggleQueryParam();
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const { paymentList, documentCount, dashboardData, } = useSelector(
    (state) => state.payment
  );

  const actions = [
    ({ row }) => (
      <div className="flex items-center gap-3">
        <i
          className="ri-eye-line text-lg text-slate-500 cursor-pointer"
          onClick={() => router.push(`/payments/${row?._id}`)}
        />
      </div>
    ),
  ];


  const statsData = [
    {
      title: "Paid Payments",
      value: dashboardData?.paid || 0,
      valueColor: "text-green-600",
    },
    {
      title: "Pending Payments",
      value: dashboardData?.pending || 0,
      valueColor: "text-yellow-500",
    },
    {
      title: "Failed Payments",
      value: dashboardData?.failed || 0,
      valueColor: "text-red-600",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardData?.revenue || 0}`,
      valueColor: "text-blue-600",
    },
  ];

  useEffect(() => {
    dispatch(
      fetchpayment({
        filters: {
          page: page,
          limit: 6,
          search,
          type: "subscription",
          status,
        },
      })
    );
  }, [dispatch, page, search, status]);

  useEffect(() => {
    dispatch(fetchpaymentdashboard())
  }, []);

  return (
    <>
      <Heading
        title="Subscription Payments"
        paragraph="View and manage all subscription payment records in one place"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
        {statsData.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-5">
        <div className="w-full md:w-5/12">
          <SearchBox
            placeholder="Search by orderId, owner name or phone"
            iconLeft={true}
            value={search}
            name="search"
            type="text"
          />
        </div>
        <div className="md:flex-none">
          <Input
            type="select"
            placeholder="Select  status"
            value={status}
            name="status"
            options={[
              { value: "Paid", label: "Paid" },
              { value: "Pending", label: "Pending" },
              { value: "Failed", label: "Failed" },
            ]}
            onChange={(e) => {
              toggleQueryParam("status", e.target.value)
            }}
          />
        </div>
      </div>


      <div className="mt-5">
        <BasicTable
          columns={columns(page)}
          data={paymentList}
          pagination={true}
          total={documentCount}
          pageSize={6}
          actionClass="uppercase"
          actionText={false}
          actions={actions}
        />
      </div>
    </>
  );
};

export default MainPayments;

const pageSize = 6;

const columns = (currPage) => [
  {
    label: "S.NO",
    key: "index",
    render: (_, __, index) => {
      const page = Number(currPage) || 1;
      return (page - 1) * pageSize + index + 1;
    },
  },
  {
    label: "PAYMENT ID",
    key: "paymentDetails",
    render: (paymentDetails) =>
      paymentDetails?.paymentId ? paymentDetails.paymentId : "-",
  },
  {
    label: "ORDER ID",
    key: "paymentDetails",
    render: (paymentDetails) =>
      paymentDetails?.orderId || "-",
  },
  {
    label: "OWNER NAME",
    key: "ownerId",
    render: (ownerId) => (
      <span className="font-semibold text-gray-800 capitalize">
        {ownerId?.name || "N/A"}
      </span>
    ),
  },
  {
    label: "MOBILE",
    key: "ownerId",
    render: (ownerId) =>
      ownerId?.mobile || "N/A",
  },
  {
    label: "SUBSCRIPTION",
    key: "subscription",
    render: (subscription) =>
      subscription?.title || "N/A",
  },
  {
    label: "PAYMENT DATE",
    key: "createdAt",
    render: (createdAt) =>
      createdAt
        ? formatDatetime(createdAt)
        : "-",
  },
  {
    label: "DURATION",
    key: "subscription",
    render: (subscription) =>
      subscription?.durationDays
        ? `${subscription.durationDays} Days`
        : "N/A",
  },
  {
    label: "EXPIRY DATE",
    key: "expiryDate",
    render: (_, row) => {
      if (
        !row?.paymentDate ||
        !row?.subscription?.durationDays
      ) {
        return "-";
      }
      const expiryDate = new Date(row.paymentDate);
      expiryDate.setDate(
        expiryDate.getDate() +
        row.subscription.durationDays
      );

      return formatDatetime(expiryDate);
    },
  },
  {
    label: "AMOUNT",
    key: "amount",
    render: (amount) => `₹${amount || 0}`,
  },
  {
    label: "PAYMENT METHOD",
    key: "paymentDetails",
    render: (paymentDetails) =>
      paymentDetails?.paymentMethod || "N/A",
  },
  {
    label: "STATUS",
    key: "status",
    render: (status) => (
      <Badge text={status} />
    ),
  },
];