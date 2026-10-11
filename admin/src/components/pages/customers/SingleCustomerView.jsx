"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Heading from "@/components/atoms/Heading";
import { fetchcustomer } from "@/components/redux/slice/customer-slice";

const SingleCustomerView = ({ id }) => {
    const dispatch = useDispatch();

    const { singlecustomer, dataLoading } = useSelector(
        (s) => s.customer   
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchcustomer({ id }));
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
                title="Customer Details"
                paragraph="View customer details"
                showBack={true}
                backRoute="/customers"
            />

            <div className="bg-white create-s-border rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mt-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">

                    <div>
                        <h2 className="text-lg md:text-lg font-semibold text-slate-800">
                            {singlecustomer?.name || "-"}
                        </h2>

                        <p className="text-sm md:text-[0.9rem] text-slate-500 mt-1">
                            Customer Information
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
                            {singlecustomer?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Father Name
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singlecustomer?.fatherName || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Mobile Number
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singlecustomer?.mobile || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Email Address
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800 break-words">
                            {singlecustomer?.email || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Aadhar Number
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800">
                            {singlecustomer?.aadhar || "-"}
                        </p>
                    </div>


                    <div>
                        <h3 className="text-sm sm:text-[0.85rem] font-normal text-slate-500">
                            Address
                        </h3>

                        <p className="mt-1 text-base md:text-[0.9rem] font-semibold text-slate-800 break-words line-clamp-3">
                            {singlecustomer?.address || "-"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SingleCustomerView;