"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@/components/common/Badge";
import Heading from "@/components/atoms/Heading";
import { fetchrent } from "@/components/redux/slice/rent-slice";
import formatDatetime from "@/components/utils/formatDatetime";

const SingleRentView = ({ id }) => {
    const dispatch = useDispatch();

    const { singleRent, dataLoading } = useSelector(
        (s) => s.rent
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchrent({ id }));
        }
    }, [dispatch, id]);

    if (dataLoading) {
        return (
            <div className="p-5 text-base md:text-[0.9rem] font-semibold">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full">
            <Heading
                title="Rent Details"
                paragraph="View rent details"
                showBack={true}
                backRoute="/rent-view"
            />

            <div className="bg-white create-s-border rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mt-5">

                {/* Status + Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">

                    <div>
                        <h2 className="text-lg md:text-lg font-semibold text-slate-800">
                            {singleRent?.roomId?.propertyId?.name || "-"}
                        </h2>

                        <p className="text-sm md:text-[0.9rem] text-slate-500 mt-1">
                            Room No : {singleRent?.roomId?.roomNumber || "-"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="bg-slate-100 rounded-xl px-4 py-3">
                            <p className="text-xs text-slate-500">
                                Paid Amount
                            </p>

                            <h3 className="text-base md:text-lg font-semibold text-slate-800 mt-1">
                                ₹{singleRent?.paidAmount || 0}
                            </h3>
                        </div>

                        <div>
                            <Badge text={singleRent?.status || "-"} />
                        </div>

                    </div>
                </div>

                {/* Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Customer Name
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            {singleRent?.tenantId?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Mobile Number
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            {singleRent?.tenantId?.mobile || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Email Address
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 break-words">
                            {singleRent?.tenantId?.email || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Customer Address
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 break-words">
                            {singleRent?.tenantId?.address || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Rent Year
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            {singleRent?.year || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Monthly Rent
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            ₹{singleRent?.roomId?.monthlyRent || 0}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Room Status
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            {singleRent?.roomId?.status || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Due Date
                        </h3>

                        <p className="mt-1 text-base sm:text-[0.9rem] font-semibold text-slate-800">
                            {formatDatetime(singleRent?.dueDate)}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Payment Date
                        </h3>

                        <p className="mt-1 text-base sm:text-[0.9rem] font-semibold text-slate-800">
                            {formatDatetime(singleRent?.paymentDate)}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SingleRentView;