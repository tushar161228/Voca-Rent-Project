"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Heading from "@/components/atoms/Heading";
import Badge from "@/components/common/Badge";

import { fetchOwnerAdmin } from "@/components/redux/slice/ownerAdmin-slice";

const SingleOwnerAdmin = ({ id }) => {
    const dispatch = useDispatch();

    const { singleOwnerAdmin, dataLoading } = useSelector(
        (s) => s.ownerAdmin
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchOwnerAdmin({ id }));
        }
    }, [dispatch, id]);

    if (dataLoading) {
        return (
            <div className="p-5 text-base md:text-[0.9rem] font-semibold">
                Loading...
            </div>
        );
    }

    const isOwner =
        singleOwnerAdmin?.role?.toLowerCase() === "owner";

    const roleText =
        singleOwnerAdmin?.role || "User";

    return (
        <div className="w-full">

            <Heading
                title={`${roleText} Details`}
                paragraph={`View ${roleText.toLowerCase()} details`}
                showBack={true}
                backRoute="/owner-admin"
            />

            <div className="bg-white create-s-border rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mt-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">

                    <div>
                        <h2 className="text-lg md:text-lg font-semibold text-slate-800 capitalize">
                            {singleOwnerAdmin?.name || "-"}
                        </h2>

                        <p className="text-sm md:text-[0.9rem] text-slate-500 mt-1 capitalize">
                            {roleText} Information
                        </p>
                    </div>

                </div>

                {/* Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Full Name
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singleOwnerAdmin?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Mobile Number
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singleOwnerAdmin?.mobile || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Email
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singleOwnerAdmin?.email || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Role
                        </h3>

                        <div className="mt-2">
                            <Badge
                                text={roleText}
                            />
                        </div>
                    </div>


                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Block Status
                        </h3>

                        <div className="mt-2">
                            <Badge
                                text={
                                    singleOwnerAdmin?.isBlocked
                                        ? "Blocked"
                                        : "Active"
                                }
                                color={
                                    singleOwnerAdmin?.isBlocked
                                        ? "red"
                                        : "green"
                                }
                            />
                        </div>
                    </div>

                </div>

                {/* Only Owner */}
                {isOwner && (
                    <div className="mt-10 border-t border-slate-200 pt-6">

                        <h2 className="text-lg font-semibold text-slate-800 mb-6">
                            Subscription Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <h3 className="text-sm text-slate-500">
                                    Plan Name
                                </h3>

                                <p className="mt-1 font-semibold text-slate-800">
                                    {singleOwnerAdmin?.subscription?.planName || "-"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500">
                                    Amount
                                </h3>

                                <p className="mt-1 font-semibold text-slate-800">
                                    ₹{singleOwnerAdmin?.subscription?.amount || 0}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500">
                                    Start Date
                                </h3>

                                <p className="mt-1 font-semibold text-slate-800">
                                    {singleOwnerAdmin?.subscription?.startDate
                                        ? new Date(
                                              singleOwnerAdmin?.subscription?.startDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500">
                                    End Date
                                </h3>

                                <p className="mt-1 font-semibold text-slate-800">
                                    {singleOwnerAdmin?.subscription?.endDate
                                        ? new Date(
                                              singleOwnerAdmin?.subscription?.endDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500">
                                    Subscription Status
                                </h3>

                                <div className="mt-2">
                                    <Badge
                                        text={
                                            singleOwnerAdmin?.subscription?.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        color={
                                            singleOwnerAdmin?.subscription?.isActive
                                                ? "green"
                                                : "red"
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SingleOwnerAdmin;