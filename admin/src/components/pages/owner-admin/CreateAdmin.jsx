"use client";

import React from "react";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { ownerAdminSchema } from "@/components/validations/ownerAdminSchema";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useRouter } from "next/navigation";

import { useForm } from "@/components/hooks/useForm";

import {
    saveOwnerAdmin,
} from "@/components/redux/slice/ownerAdmin-slice";

import {
    successToast,
    errorToast,
} from "@/components/utils/toastMessage";

const CreateAdmin = ({ id }) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { loading } = useSelector(
        (state) => state.ownerAdmin
    );

    const {
        formData,
        errors,
        handleChange,
        handleSubmit,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            password: "",
        },

        schema: ownerAdminSchema,
    });

    const onSubmit = async (data) => {
        try {

            await dispatch(
                saveOwnerAdmin({
                    id,
                    ownerAdminData: data,
                })
            ).unwrap();

            successToast(
                id
                    ? "Admin updated successfully"
                    : "Admin created successfully"
            );

            router.push("/owner-admin");

        } catch (err) {

            errorToast(
                err || "Failed to save admin"
            );
        }
    };

    return (
        <div className="space-y-6">

            <Heading
                title={
                    id
                        ? "Edit Admin"
                        : "Create Admin"
                }
                paragraph="Manage admin details"
                showBack
                backRoute="/owner-admin"
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Input
                        label="Full Name"
                        placeholder="Enter full name"
                        type="text"
                        name="name"
                        maxLength={40}
                        value={formData.name}
                        onChange={(e) =>
                            handleChange(
                                "name",
                                e.target.value
                            )
                        }
                        error={errors.name}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        maxLength={40}
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) =>
                            handleChange(
                                "email",
                                e.target.value
                            )
                        }
                        error={errors.email}
                    />

                    <Input
                        label="Mobile Number"
                        type="tel"
                        name="mobile"
                        maxLength={10}
                        onKeyDown={(e) => {
                            if (
                                !/[0-9]/.test(e.key) &&
                                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                            ) {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={(e) =>
                            handleChange(
                                "mobile",
                                e.target.value
                            )
                        }
                        error={errors.mobile}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) =>
                            handleChange(
                                "password",
                                e.target.value
                            )
                        }
                        error={errors.password}
                        iconEye={true}
                    />

                </div>

                <div className="flex justify-end gap-4">

                    <Button
                        type="submit"
                        variant="gradient"
                        loading={loading}
                        disabled={loading}
                    >
                        {
                            id
                                ? "Update Admin"
                                : "Save Admin"
                        }
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            router.push("/owner-admin")
                        }
                    >
                        Cancel
                    </Button>

                </div>

            </form>
        </div>
    );
};

export default CreateAdmin;