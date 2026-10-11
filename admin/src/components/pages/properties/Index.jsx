"use client";

import Heading from "@/components/atoms/Heading";
import OverviewCard from "@/components/molecules/OverviewCard";
import React, { useEffect } from "react";
import PropertyTable from "./PropertyTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "@/components/redux/slice/property-slice";
import SearchBox from "@/components/atoms/SearchBox";
import { useSearchParams } from "next/navigation";

const MainProperties = ({ page }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const ownerId = searchParams.get("ownerId") || "";
  const { dashboardData } = useSelector((s) => s.property);

  const statsData = [
    {
      title: "Total Properties",
      value: dashboardData?.totalProperties || 0,
      valueColor: "text-blue-600",
    },
    {
      title: "Total Rooms",
      value: dashboardData?.totalRooms || 0,
      valueColor: "text-green-600",
    },
    {
      title: "Available Rooms",
      value: dashboardData?.totalAvailable || 0,
      valueColor: "text-yellow-500",
    },
    {
      title: "Occupied Rooms",
      value: dashboardData?.totalOccupied || 0,
      valueColor: "text-red-500",
    },
  ];

  useEffect(() => {
    dispatch(fetchDashboard({ filters: { ownerId, search, } }));
  }, [dispatch, ownerId, search]);

  return (
    <div>
      <Heading
        title="All Properties"
        paragraph="Manage all properties"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
        {statsData.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      <div className="mt-5 md:max-w-md">
        <SearchBox
          placeholder="Search by properties name, name or phone"
          iconLeft={true}
          value={search}
          name="search"
          type="text"
        />
      </div>

      <PropertyTable currPage={page} search={search} ownerId={ownerId} />
    </div>
  );
};

export default MainProperties;