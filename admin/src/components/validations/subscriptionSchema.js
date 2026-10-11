import * as Yup from "yup";

export const subscriptionSchema = Yup.object().shape({
  title: Yup.string()
    .transform((value) => value?.trim())
    .min(3, "Plan title must be at least 3 characters")
    .max(50, "Plan title cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s\-&()]+$/,
      "Title contains invalid characters"
    )
    .required("Plan title is required"),

  description: Yup.string()
    .transform((value) => value?.trim())
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),

  price: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Price must be a valid number")
    .required("Price is required")
    .moreThan(1, "Price must be greater than 1")
    .max(999999, "Price is too high")
    .test(
      "decimal-limit",
      "Price can have maximum 2 decimal places",
      (value) =>
        value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),

  durationDays: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Duration must be a valid number")
    .required("Duration is required")
    .integer("Duration must be a whole number")
    .min(1, "Minimum duration is 1 day")
    .max(3650, "Duration cannot exceed 10 years")
    .test(
      "valid-duration",
      "Duration should match common subscription periods",
      (value) =>
        !value ||
        [
          7, 14, 15, 30, 60, 90, 180, 365, 730, 1095,
        ].includes(value)
    ),

  features: Yup.object().shape({
    whatsappAlerts: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .typeError("Whatsapp alerts must be a valid number")
      .integer("Whatsapp alerts must be a whole number")
      .min(1, "At least 1 Whatsapp alert is required")
      .required("Whatsapp alerts is required"),

    ivrCalls: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .typeError("IVR calls must be a valid number")
      .integer("IVR calls must be a whole number")
      .min(1, "At least 1 IVR call is required")
      .required("IVR calls is required"),

    maxTenants: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .typeError("Max tenants must be a valid number")
      .integer("Max tenants must be a whole number")
      .min(1, "At least 1 tenant is required")
      .required("Max tenants is required"),

  }),

  isActive: Yup.boolean().default(true),
});