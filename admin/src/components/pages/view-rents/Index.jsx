"use client";

import React, { useEffect } from "react";
import BasicTable from "@/components/common/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchrent, fetchrentdashboard } from "@/components/redux/slice/rent-slice";
import formatDatetime from "@/components/utils/formatDatetime";
import Badge from "@/components/common/Badge";
import Heading from "@/components/atoms/Heading";
import OverviewCard from "@/components/molecules/OverviewCard";
import { useRouter } from "next/navigation";
import SearchBox from "@/components/atoms/SearchBox";
import { useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useToggleQueryParam } from "@/components/utils/toggleQueryParam";

const RentManagementTable = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toggleQueryParam = useToggleQueryParam();
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const { rentList, documentCount, dashboardData, } = useSelector(
    (state) => state.rent
  );

  const actions = [
    ({ row }) => (
      <div className="flex items-center gap-3">
        <i
          className="ri-eye-line text-lg text-slate-500 cursor-pointer"
          onClick={() => router.push(`/rent-view/${row?._id}`)}
        />
      </div>
    ),
  ];


  const statsData = [
    {
      title: "Paid Rents",
      value: dashboardData?.paidRents || 0,
      valueColor: "text-green-600",
    },
    {
      title: "Pending Rents",
      value: dashboardData?.pendingRents || 0,
      valueColor: "text-yellow-500",
    },
    {
      title: "Overdue Rents",
      value: dashboardData?.overdueRents || 0,
      valueColor: "text-red-600",
    },
    {
      title: "Total Paid Amount",
      value: `₹${dashboardData?.totalPaidAmount || 0}`,
      valueColor: "text-blue-600",
    },
  ];

  useEffect(() => {
    dispatch(
      fetchrent({
        filters: {
          page: page,
          limit: 6,
          search,
          status,
        },
      })
    );
  }, [dispatch, page, search, status]);

  useEffect(() => {
    dispatch(fetchrentdashboard())
  }, []);

  return (
    <>
      <Heading
        title="Rent View"
        paragraph="View and manage all rent payments in one place"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
        {statsData.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-5">
        <div className="w-full md:w-5/12">
          <SearchBox
            placeholder="Search by tenant name or phone"
            iconLeft={true}
            value={search}
            name="search"
            type="text"
          />
        </div>
        <div className="md:flex-none">
          <Input
            type="select"
            placeholder="Select status"
            value={status}
            name="status"
            options={[
              { value: "Paid", label: "Paid" },
              { value: "Pending", label: "Pending" },
              { value: "Overdue", label: "Overdue" },
              { value: "PartiallyPaid", label: "Partially Paid" },
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
          data={rentList}
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

export default RentManagementTable;

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
    label: "CUSTOMER NAME",
    key: "tenantId",
    render: (tenantId) => (
      <span className="font-semibold text-gray-800">
        {tenantId?.name || "N/A"}
      </span>
    ),
  },
  {
    label: "MOBILE",
    key: "tenantId",
    render: (tenantId) => tenantId?.mobile || "N/A",
  },
  {
    label: "PROPERTY",
    key: "roomId",
    render: (roomId) =>
      roomId?.propertyId?.name || "N/A",
  },
  {
    label: "ROOM NO",
    key: "roomId",
    render: (roomId) =>
      roomId?.roomNumber || "N/A",
  },
  {
    label: "MONTHLY RENT",
    key: "roomId",
    render: (roomId) =>
      roomId?.monthlyRent
        ? `₹${roomId.monthlyRent}`
        : "N/A",
  },
  {
    label: "PAID AMOUNT",
    key: "paidAmount",
    render: (paidAmount) => `₹${paidAmount || 0}`,
  },
  {
    label: "STATUS",
    key: "status",
    render: (status) => (
      <Badge text={status} />
    ),
  },
  {
    label: "DUE DATE",
    key: "dueDate",
    render: (dueDate) =>
      dueDate ? formatDatetime(dueDate) : "-",
  },
  {
    label: "PAYMENT DATE",
    key: "paymentDate",
    render: (paymentDate) =>
      paymentDate
        ? formatDatetime(paymentDate)
        : "-",
  },
];