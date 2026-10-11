// ownerAdminSchema.js

import * as Yup from "yup";

export const ownerAdminSchema = Yup.object({

    name: Yup.string()
        .trim()

        .min(
            3,
            "Full name must be at least 3 characters"
        )
        .max(
            50,
            "Full name cannot exceed 50 characters"
        )
        .matches(
            /^[A-Za-z\s]+$/,
            "Only alphabets are allowed in full name"
        )
        .required("Full name is required"),

    email: Yup.string()
        .trim()
        .lowercase()
        .email("Please enter a valid email address")
        .required("Email address is required"),

    mobile: Yup.string()
        .matches(/^[6-9][0-9]{9}$/, "Please enter a valid 10-digit mobile number")
        .length(10, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),

    password: Yup.string()

        .min(
            6,
            "Password must be at least 6 characters"
        )
        .max(
            20,
            "Password cannot exceed 20 characters"
        )
        .matches(
            /^(?=.*[A-Z])/,
            "Password must contain at least 1 uppercase letter"
        )
        .matches(
            /^(?=.*[a-z])/,
            "Password must contain at least 1 lowercase letter"
        )
        .matches(
            /^(?=.*\d)/,
            "Password must contain at least 1 number"
        )
        .required("Password is required"),

});