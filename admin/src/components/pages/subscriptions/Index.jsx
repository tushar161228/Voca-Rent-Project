"use client";

import React, { useEffect, useState } from "react";
import Heading from "@/components/atoms/Heading";
import SubscriptionCard from "@/components/molecules/SubscriptionCard";
import SubscriptionTable from "./SubscriptionTable";
import DataNotFound from "@/components/atoms/DataNotFound";
import Skeleton from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import OverlayModal from "@/components/common/OverlayModal";
import { AlertModal } from "@/components/common/AlertModal";
import {
  fetchsubscription,
  deletesubscription,
} from "@/components/redux/slice/subscription-slice";

import {
  successToast,
  errorToast,
} from "@/components/utils/toastMessage";

import {
  useDispatch,
  useSelector,
} from "react-redux";

const Mainsubscription = ({ page }) => {
  const dispatch = useDispatch();

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const {
    subscriptionList = [],
    documentCount,
    dataLoading,
  } = useSelector(
    (state) => state.subscription
  );

  useEffect(() => {
    dispatch(
      fetchsubscription({
        filters: {
          page,
          limit: 6,
        },
      })
    );
  }, [dispatch, page]);

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
            page: page,
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


  return (
    <>
      <Heading
        title="Subscription Plans"
        paragraph="Manage all subscription plans"
        actions={[
          {
            text: "Create Plan",
            icon: "ri-add-line",
            variant: "gradient",
            href: "/subscriptions/add-new",
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

        {dataLoading &&
          Array.from({ length: 6 }).map(
            (_, index) => (
              <Skeleton
                key={index}
                variant="subscription-card"
              />
            )
          )}

        {!dataLoading &&
          subscriptionList?.map((plan) => (
            <SubscriptionCard
              key={plan._id}
              {...plan}
              href={`/subscriptions/${plan._id}`}
              onDelete={() => {
                setSelectedPlan(plan);
                setDeleteModalOpen(true);
              }}
            />
          ))}

        {!dataLoading &&
          documentCount === 0 && (
            <DataNotFound />
          )}
      </div>

      <div className="flex justify-end mt-5">
        <Pagination
          total={documentCount}
          pageSize={6}
        />
      </div>

      <SubscriptionTable
        currPage={page}
      />

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
                "bg-gray-100 text-black",
            },
            {
              text: "Delete",
              onClick: handleDelete,
              colorClass:
                "bg-red-600 text-white hover:bg-red-500",
            },
          ]}
        />
      </OverlayModal>
    </>
  );
};

export default Mainsubscription;