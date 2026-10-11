"use client";

import React, { useEffect, useState, useRef, } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { updateUserDetails } from "@/components/redux/slice/auth-slice";

const ProfileEditForm = ({ user }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state) => state.auth
    );


    const dobInputRef = useRef(null);

    const openDatePicker = () => {

        if (dobInputRef.current?.showPicker) {

            dobInputRef.current.showPicker();

        } else {

            dobInputRef.current?.focus();
        }
    };
    const initialFormData = {
        name: user?.name || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        dob: user?.dob
            ? new Date(user.dob)
                .toISOString()
                .split("T")[0]
            : "",
    };

    const [formData, setFormData] =
        useState(initialFormData);

    const [isEdited, setIsEdited] =
        useState(false);

    useEffect(() => {
        const changed =
            JSON.stringify(formData) !==
            JSON.stringify(initialFormData);

        setIsEdited(changed);

    }, [formData]);

    const handleChange = (key, value) => {

        if (key === "name") {

            value = value
                .replace(/[^A-Za-z\s]/g, "") // remove symbols/numbers
                .replace(/\s{2,}/g, " ") // multiple spaces -> single
                .trimStart(); // no starting spaces
        }

        if (key === "mobile") {

            value = value.replace(/\D/g, "");
        }

        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {

        const res = await dispatch(
            updateUserDetails(formData)
        );

        if (
            updateUserDetails.fulfilled.match(res)
        ) {
            setIsEdited(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                <Input
                    label="Full Name"
                    value={formData.name}
                    maxLength={30}
                    onChange={(e) =>
                        handleChange(
                            "name",
                            e.target.value
                        )
                    }
                />

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    maxLength={40}
                    onChange={(e) =>
                        handleChange(
                            "email",
                            e.target.value
                        )
                    }
                />

                <Input
                    label="Mobile"
                    type="mobile"
                    value={formData.mobile}
                    maxLength={40}
                    onChange={(e) =>
                        handleChange(
                            "mobile",
                            e.target.value
                        )
                    }
                    disabled
                    className="cursor-not-allowed"
                />

            </div>

            <div className="md:col-span-2 flex justify-end mt-4 md:mt-5">

                <Button
                    children={
                        loading
                            ? "Updating..."
                            : "Update Profile"
                    }
                    variant="gradient"
                    className="rounded-[11px] py-[9px]"
                    onClick={handleSubmit}
                    disabled={
                        loading || !isEdited
                    }
                />
            </div>

        </div>
    );
};

export default ProfileEditForm;