"use client";

import BasicTable from "@/components/common/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProperty } from "@/components/redux/slice/property-slice";
import { useRouter } from "next/navigation";
import Badge from "@/components/common/Badge";

const PropertyTable = ({ currPage, search, ownerId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { propertyList, documentCount } = useSelector(
    (s) => s.property
  );

  const actions = [
    ({ row }) => (
      <div className="flex items-center gap-3">
        <i
          className="ri-eye-line text-lg text-slate-500 cursor-pointer"
          onClick={() => router.push(`/properties/${row?._id}`)}
        />
        <i
          className="ri-user-settings-line text-lg text-blue-500 cursor-pointer"
          onClick={() => router.push(`/customers?propertyId=${row?._id}`)}
        />
      </div>
    ),
  ];


  useEffect(() => {
    dispatch(
      fetchProperty({
        filters: {
          page: currPage,
          limit: 6,
          search,
          ownerId
        },
      })
    );
  }, [dispatch, currPage, search, ownerId]);

  return (
    <div className="mt-5">
      <BasicTable
        columns={columns(currPage)}
        data={propertyList}
        actions={actions}
        pagination={true}
        total={documentCount}
        pageSize={6}
        actionClass="uppercase"
        actionText={false}
      />
    </div>
  );
};

export default PropertyTable;

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
    label: "NAME",
    key: "ownerId",
    render: (ownerId) => (
      <div className="font-medium capitalize text-slate-800">
        {ownerId?.name || "-"}
      </div>
    ),
  },
  {
    label: "PHONE",
    key: "ownerId",
    render: (ownerId) => (
      <div className="text-sm text-slate-600">
        {ownerId?.mobile || "-"}
      </div>
    ),
  },
  {
    label: "PROPERTY NAME",
    key: "name",
    render: (name) => (
      <div className="font-semibold text-gray-800">
        {name || "-"}
      </div>
    ),
  },
  {
    label: "ADDRESS",
    key: "address",
    render: (address) => (
      <span className="text-[#667085]">
        {address || "-"}
      </span>
    ),
  },
  {
    label: "ROOMS",
    key: "totalRooms",
    render: (totalRooms) => (
      <span className="font-medium text-gray-800">
        {totalRooms || 0}
      </span>
    ),
  },

  {
    label: "AVAILABLE",
    key: "availableRooms",
    render: (availableRooms) => (
      <span className="text-green-600 font-medium">
        {availableRooms || 0}
      </span>
    ),
  },

  {
    label: "OCCUPIED",
    key: "occupiedRooms",
    render: (occupiedRooms) => (
      <span className="text-red-500 font-medium">
        {occupiedRooms || 0}
      </span>
    ),
  },
  {
    label: "DESCRIPTION",
    key: "description",
    render: (description) => (
      <div className="min-w-56 text-wrap line-clamp-2">
        {description || "-"}
      </div>
    ),
  },
  {
    label: "IMAGES",
    key: "images",
    render: (images) => (
      <Badge
        text={`${images?.length || 0} Images`}
      />
    ),
  },
];