"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@/components/common/Badge";
import Heading from "@/components/atoms/Heading";
import { fetchpayment } from "@/components/redux/slice/payment-slice";
import formatDatetime from "@/components/utils/formatDatetime";

const SinglePaymentHistory = ({ id }) => {
  const dispatch = useDispatch();

  const { singlePayment, dataLoading } = useSelector(
    (s) => s.payment
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchpayment({ id }));
    }
  }, [dispatch, id]);

  if (dataLoading) {
    return (
      <div className="p-5 text-base md:text-[0.9rem] font-semibold">
        Loading...
      </div>
    );
  }

  const expiryDate = () => {
    if (
      !singlePayment?.createdAt ||
      !singlePayment?.subscription?.durationDays
    ) {
      return "-";
    }

    const expiry = new Date(
      singlePayment.createdAt
    );

    expiry.setDate(
      expiry.getDate() +
      singlePayment.subscription.durationDays
    );

    return formatDatetime(expiry);
  };


  return (
    <div className="w-full">
      <Heading
        title="Payment Details"
        paragraph="View payment details"
        showBack={true}
        backRoute="/payments"
      />

      <div className="bg-white create-s-border rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mt-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800">
              {singlePayment?.subscription?.title || "-"}
            </h2>

            <p className="text-sm md:text-[0.9rem] text-slate-500 mt-1">
              Order ID :{" "}
              {singlePayment?.paymentDetails?.orderId ||
                "-"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            <div className="bg-slate-100 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500">
                Amount
              </p>

              <h3 className="text-base md:text-lg font-semibold text-slate-800 mt-1">
                ₹{singlePayment?.amount || 0}
              </h3>
            </div>

            <div>
              <Badge
                text={singlePayment?.status || "-"}
              />
            </div>

          </div>
        </div>

        {/* Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Payment ID
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 break-all">
              {singlePayment?.paymentDetails?.paymentId || "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500 capitalize">
              Owner Name
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 capitalize">
              {singlePayment?.ownerId?.name || "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Mobile Number
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
              {singlePayment?.ownerId?.mobile || "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Subscription Plan
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
              {singlePayment?.subscription?.title ||
                "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Duration
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
              {singlePayment?.subscription
                ?.durationDays
                ? `${singlePayment.subscription.durationDays} Days`
                : "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Payment Method
            </h3>

            <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 uppercase">
              {singlePayment?.paymentDetails
                ?.paymentMethod || "-"}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Payment Status
            </h3>

            <div className="mt-2">
              <Badge
                text={singlePayment?.status || "-"}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Payment Date
            </h3>

            <p className="mt-1 text-base sm:text-[0.9rem] font-semibold text-slate-800">
              {formatDatetime(singlePayment?.createdAt)}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
              Expiry Date
            </h3>

            <p className="mt-1 text-base sm:text-[0.9rem] font-semibold text-slate-800">
              {expiryDate()}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SinglePaymentHistory;