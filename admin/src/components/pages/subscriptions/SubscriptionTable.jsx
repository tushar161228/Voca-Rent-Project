"use client";

import React, { useEffect, useState } from "react";
import BasicTable from "@/components/common/BasicTable";
import Badge from "@/components/common/Badge";
import {
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deletesubscription,
  fetchsubscription,
  savesubscription
} from "@/components/redux/slice/subscription-slice";
import {
  successToast,
  errorToast,
} from "@/components/utils/toastMessage";
import OverlayModal from "@/components/common/OverlayModal";
import { AlertModal } from "@/components/common/AlertModal";
import formatDatetime from "@/components/utils/formatDatetime";
import Switch from "@/components/common/Switch";
import Input from "@/components/common/Input";
import { useToggleQueryParam } from "@/components/utils/toggleQueryParam";
import { useSearchParams } from "next/navigation";


export default function SubscriptionTable({ currPage }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const toggleQueryParam = useToggleQueryParam();
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState(null);
  const { subscriptionList = [],documentCount } = useSelector((s) => s.subscription);

  const filteredSubscriptions = subscriptionList.filter((item) => {
    if (status === "active") return item.isActive === true;
    if (status === "closed") return item.isActive === false;
    return true;
  });

  useEffect(() => {
    dispatch(
      fetchsubscription({
        filters: {
          page: currPage,
          limit: 6,
        },
      })
    );
  }, [dispatch, currPage]);

  const handleDelete = async () => {
    try {
      await dispatch(
        deletesubscription({
          Id: selectedPlan?._id,
        })
      ).unwrap();

      successToast(
        "Subscription deleted successfully"
      );

      setDeleteModalOpen(false);

      dispatch(
        fetchsubscription({
          filters: {
            page: currPage,
            limit: 6,
          },
        })
      );
    } catch (err) {
      errorToast(
        err?.message ||
        "Failed to delete subscription"
      );
    }
  };

  const handleStatus = async (row) => {
    try {
      await dispatch(
        savesubscription({
          Id: row._id,
          subscriptionData: {
            ...row,
            isActive: !row.isActive,
          },
        })
      ).unwrap();

      successToast("Status updated successfully");

      dispatch(
        fetchsubscription({
          filters: {
            page: currPage,
            limit: 6,
          },
        })
      );
    } catch (err) {
      errorToast(
        err?.message || "Failed to update status"
      );
    }
  };

  const actions = [
    ({ row }) => (
      <button
        onClick={() =>
          router.push(
            `/subscriptions/${row?._id}`
          )
        }
        className="text-green-600 hover:text-green-700 cursor-pointer"
      >
        <Pencil size={18} />
      </button>
    ),

    ({ row }) => (
      <button
        onClick={() => {
          setSelectedPlan(row);
          setDeleteModalOpen(true);
        }}
        className="text-red-600 hover:text-red-700 cursor-pointer"
      >
        <Trash2 size={18} />
      </button>
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
      label: "PLAN",
      key: "title",
    },
    {
      label: "PRICE",
      key: "price",
      render: (price, row) => (
        <span>
          {row.currency} {price}
        </span>
      ),
    },
    {
      label: "DURATION",
      key: "durationDays",
      render: (durationDays) => (
        <span>{durationDays} Days</span>
      ),
    },
    {
      label: "WHATSAPP",
      key: "features",
      render: (features) => (
        <span>
          {features?.whatsappAlerts || 0}
        </span>
      ),
    },
    {
      label: "IVR CALLS",
      key: "features",
      render: (features) => (
        <span>
          {features?.ivrCalls || 0}
        </span>
      ),
    },
    {
      label: "MAX TENANTS",
      key: "features",
      render: (features) => (
        <span>
          {features?.maxTenants || 0}
        </span>
      ),
    },
    {
      label: "STATUS",
      key: "isActive",
      render: (isActive) => (
        <Badge
          text={
            isActive
              ? "Active"
              : "Closed"
          }
        />
      ),
    },
    {
      label: "ACTIVE/CLOSED",
      key: "isActive",
      render: (isActive, row) => {
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onChange={() => handleStatus(row)}
              dynamicBg={isActive ? "bg-green-500" : "bg-gray-200"}
            />
          </div>
        );
      },
    },
    {
      label: "CREATED",
      key: "createdAt",
      render: (createdAt) => (
        <span>
          {formatDatetime(
            createdAt,
            "slashDate"
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 mt-6">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 ">
          <h2 className="text-lg font-semibold">
            All Subscription Plans
          </h2>
          <div className="md:flex-none ">
            <Input
              type="select"
              placeholder="Select status"
              value={status}
              name="status"
              options={[
                { value: "active", label: "Active" },
                { value: "closed", label: "Closed" },
              ]}
              onChange={(e) => {
                toggleQueryParam("status", e.target.value)
              }}
            />
          </div>

        </div>

        <BasicTable
          columns={columns(currPage)}
          data={filteredSubscriptions}
          actions={actions}
          pageSize={6}
          total={documentCount}
          pagination={true}
          bordered={false}
        />
      </div>

      <OverlayModal
        isOpen={deleteModalOpen}
        onClose={() =>
          setDeleteModalOpen(false)
        }
        showCloseIcon={false}
      >
        <AlertModal
          title="Delete Subscription"
          message={`Are you sure you want to delete ${selectedPlan?.title} ?`}
          buttons={[
            {
              text: "Cancel",
              onClick: () =>
                setDeleteModalOpen(false),
              colorClass:
                "bg-gray-200 text-black",
            },
            {
              text: "Delete",
              onClick: handleDelete,
              colorClass:
                "bg-red-600 text-white",
            },
          ]}
        />
      </OverlayModal>
    </>
  );
}