"use client";

import React, { useState } from "react";
import {
    Phone,
    Calendar,
    Mail,
    ShieldCheck,
} from "lucide-react";

import Button from "@/components/common/Button";
import ProfileEditForm from "./ProfileEditForm";

const ProfileHeader = ({ user }) => {
    const [isEdit, setIsEdit] = useState(false);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="relative overflow-hidden create-s-border rounded-lg md:rounded-xl lg:rounded-3xl">

            {/* Top Gradient */}
            <div className="h-24 md:h-32 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

            <div className="relative px-5 md:px-8 pb-6">

                {/* Profile Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 -mt-14">

                    <div className="flex flex-col sm:flex-row sm:items-end gap-5">

                        {/* Avatar */}
                        <div className="h-20 w-20 md:h-28 md:w-28 rounded-lg md:rounded-xl lg:rounded-3xl border-4 border-white bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center text-white text-4xl font-bold uppercase">
                            {user?.name?.charAt(0)}
                        </div>

                        {/* User Info */}
                        <div className="pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-3xl font-bold text-slate-800 capitalize line-clamp-1 min-w-[200px] max-w-[200px] ">
                                    {user?.name}
                                </h1>

                                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold flex items-center gap-1">
                                    <ShieldCheck size={14} />
                                    {user?.role}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 mt-1">
                                Joined {formatDate(user?.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        onClick={() => setIsEdit(!isEdit)}
                        children={isEdit ? "Close" : "Edit Profile"}
                        icon={isEdit ? "close-line" : "edit-line"}
                        className="rounded-xl py-3 md:py-2"
                    />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                                <Mail size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Email Address
                                </p>

                                <h3 className="font-semibold text-slate-800 break-all">
                                    {user?.email || "No Email"}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                <Phone size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Mobile Number
                                </p>

                                <h3 className="font-semibold text-slate-800">
                                    {user?.mobile || "-"}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <Calendar size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Account Created
                                </p>

                                <h3 className="font-semibold text-slate-800">
                                    {formatDate(user?.createdAt)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                {isEdit && (
                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <ProfileEditForm user={user} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;