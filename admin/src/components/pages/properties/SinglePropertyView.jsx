"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import Heading from "@/components/atoms/Heading";
import { fetchProperty } from "@/components/redux/slice/property-slice";

const placeholderImage = "https://placehold.co/600x400/png";

// Reusable Image Component
const PropertyImage = ({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(
        src || placeholderImage
    );

    return (
        <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            onError={() => {
                setImageSrc(placeholderImage);
            }}
        />
    );
};

const SinglePropertyView = ({ id }) => {
    const dispatch = useDispatch();

    const { singleProperty, dataLoading } =
        useSelector((s) => s.property);

    useEffect(() => {
        if (id) {
            dispatch(fetchProperty({ id }));
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
                title="Property Details"
                paragraph="View property details"
                showBack={true}
                backRoute="/properties"
            />

            <div className="bg-white create-s-border rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mt-5">

                {/* Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">

                    {singleProperty?.images?.length > 0 ? (
                        singleProperty.images.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-xl"
                            >
                                <PropertyImage
                                    src={img}
                                    alt={`Property Image ${index + 1}`}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-xl">
                            <PropertyImage
                                src={placeholderImage}
                                alt="Property Placeholder"
                            />
                        </div>
                    )}
                </div>

                {/* Property Summary */}
                <div className="mt-8 grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Total Rooms
                        </h3>

                        <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">
                            {singleProperty?.totalRooms || 0}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Available Rooms
                        </h3>

                        <p className="mt-2 text-xl sm:text-2xl font-bold text-green-600">
                            {singleProperty?.availableRooms || 0}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Occupied Rooms
                        </h3>

                        <p className="mt-2 text-xl sm:text-2xl font-bold text-red-500">
                            {singleProperty?.occupiedRooms || 0}
                        </p>
                    </div>

                </div>

                {/* Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    <div>
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Property Name
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 break-words">
                            {singleProperty?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Address
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 break-words">
                            {singleProperty?.address || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Owner Name
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800 capitalize">
                            {singleProperty?.ownerId?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Owner Mobile
                        </h3>

                        <p className="mt-1 text-base sm:text-md md:text-[0.9rem] font-semibold text-slate-800">
                            {singleProperty?.ownerId?.mobile || "-"}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm sm:text-base font-normal text-slate-500">
                            Description
                        </h3>

                        <p className="mt-2 text-sm sm:text-base md:text-[0.9rem] leading-5 text-slate-700 line-clamp-3">
                            {singleProperty?.description || "-"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SinglePropertyView;