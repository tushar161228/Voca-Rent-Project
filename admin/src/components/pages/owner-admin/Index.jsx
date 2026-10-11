"use client";

import BasicTable from "@/components/common/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchOwnerAdmin,
  saveOwnerAdmin,
} from "@/components/redux/slice/ownerAdmin-slice";
import Heading from "@/components/atoms/Heading";
import { useRouter } from "next/navigation";
import Switch from "@/components/common/Switch";
import Badge from "@/components/common/Badge";
import { successToast, errorToast } from "@/components/utils/toastMessage";
import Input from "@/components/common/Input";
import { useToggleQueryParam } from "@/components/utils/toggleQueryParam";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/atoms/SearchBox";


const MainOwnerAdmin = ({ currPage }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const toggleQueryParam = useToggleQueryParam();
  const [loadingId, setLoadingId] = useState("");

  const { ownerAdminList, documentCount } = useSelector(
    (s) => s.ownerAdmin
  );
  const { user } = useSelector((s) => s.auth);

  const filteredOwnerAdminList = ownerAdminList?.filter(
    (item) => item?._id !== user?._id
  );

  const handleBlock = async (row) => {
    try {
      setLoadingId(row?._id);

      const payload = {
        isBlocked: !row?.isBlocked,
      };

      const res = await dispatch(
        saveOwnerAdmin({
          id: row?._id,
          ownerAdminData: payload,
        })
      );

      if (
        res?.payload?.success ||
        res?.meta?.requestStatus === "fulfilled"
      ) {
        successToast(
          row?.isBlocked
            ? "Owner unblocked successfully"
            : "Owner blocked successfully"
        );

        dispatch(
          fetchOwnerAdmin({
            filters: {
              page: currPage,
              limit: 6,
            },
          })
        );
      } else {
        errorToast("Something went wrong");
      }
    } catch (error) {
      errorToast("Something went wrong");
    } finally {
      setLoadingId("");
    }
  };

  const actions = [
    ({ row }) => (
      <div className="flex items-center gap-4">
        <i
          className="ri-eye-line text-lg text-slate-500 cursor-pointer"
          onClick={() => router.push(`/owner-admin/${row?._id}`)}
        />
        <i
          className="ri-building-line text-lg text-blue-500 cursor-pointer"
          onClick={() => router.push(`/properties?ownerId=${row?._id}`)}
        />
      </div>
    ),
  ];

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
      key: "name",
      render: (name) => (
        <div className="font-semibold text-gray-800">
          {name || "-"}
        </div>
      ),
    },

    {
      label: "ROLE",
      key: "role",
      render: (role) => (
        <span className="capitalize text-[#667085]">
          {role || "-"}
        </span>
      ),
    },

    {
      label: "EMAIL",
      key: "email",
      render: (email) => (
        <span className="text-[#667085]">
          {email || "-"}
        </span>
      ),
    },

    {
      label: "PHONE",
      key: "mobile",
      render: (mobile) => (
        <span className="text-[#667085]">
          {mobile || "-"}
        </span>
      ),
    },

    {
      label: "SUBSCRIPTION ",
      key: "subscription",
      render: (subscription) => (
        <span className="text-[#667085]">
          {subscription?.planName || "No Plan"}
        </span>
      ),
    },

    {
      label: "AMOUNT",
      key: "subscription",
      render: (subscription) => (
        <span className="text-[#667085]">
          ₹{subscription?.amount || 0}
        </span>
      ),
    },
    {
      label: "BLOCK STATUS",
      key: "isBlocked",
      render: (isBlocked) => (
        <Badge
          text={isBlocked ? "Blocked" : "Active"}
        />
      ),
    },

    {
      label: "BLOCK/UNBLOCK",
      key: "isBlocked",
      render: (isBlocked, row) => {
        return (
          <div className="flex items-center gap-3">

            <Switch
              checked={isBlocked}
              onChange={() => handleBlock(row)}
              isBlocked={loadingId === row?._id}
              dynamicBg={isBlocked ? "bg-red-500" : "bg-gray-200"}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      fetchOwnerAdmin({
        filters: {
          page: currPage,
          limit: 6,
          role,
          search,
        },
      })
    );
  }, [dispatch, currPage, role, search]);

  return (
    <>
      <Heading
        title="Owner Admin"
        paragraph="View and manage all owners in one place"
        actions={[
          {
            text: "Add New",
            icon: "ri-add-line",
            onClick: () => router.push("/owner-admin/add-new"),
          },
        ]}
      />

      <div className="flex justify-between items-center  mt-5">
        <div className="md:flex-1 max-w-md">
          <SearchBox
            placeholder="Search by name, email or phone"
            iconLeft={true}
            value={search}
            name="search"
            type="text"
          />
        </div>
        <div className="md:flex-none ">
          <Input
            type="select"
            placeholder="Select by role"
            value={role}
            name="role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "owner", label: "Owner" },
            ]}
            onChange={(e) => {
              toggleQueryParam("role", e.target.value)
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        <BasicTable
          columns={columns(currPage)}
          data={filteredOwnerAdminList || []}
          pagination={true}
          total={documentCount || 0}
          pageSize={6}
          actions={actions}
          actionClass="uppercase"
          actionText={false}
        />
      </div>
    </>
  );
};

export default MainOwnerAdmin;