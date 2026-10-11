"use client";

import React, { useEffect } from "react";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "@/components/hooks/useForm";
import {
  savesubscription,
  fetchsubscription,
  clearSingleSubscription
} from "@/components/redux/slice/subscription-slice";
import { subscriptionSchema } from "@/components/validations/subscriptionSchema";
import {
  successToast,
  errorToast,
} from "@/components/utils/toastMessage";


const SubscriptionForm = ({ id }) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    loading,
    singlesubscription,
  } = useSelector(
    (state) => state.subscription
  );

  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      durationDays: "",
      features: {
        whatsappAlerts: 0,
        ivrCalls: 0,
        maxTenants: 0,
      },
      isActive: true,
    },

    schema: subscriptionSchema,
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        savesubscription({
          Id: id,

          subscriptionData: {
            ...data,
            price: Number(data.price),
            durationDays: Number(
              data.durationDays
            ),
          },
        })
      ).unwrap();

      successToast(
        id
          ? "Subscription updated successfully"
          : "Subscription created successfully"
      );

      router.push("/subscriptions");
    } catch (err) {
      errorToast(
        err?.message ||
        "Failed to save subscription"
      );
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchsubscription({ id }));
    } else {
      dispatch(clearSingleSubscription());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (singlesubscription?._id) {
      setFormData({
        title: singlesubscription?.title || "",
        description:
          singlesubscription?.description || "",
        price: singlesubscription?.price || "",
        durationDays:
          singlesubscription?.durationDays || "",
        features:
          singlesubscription?.features || {
            whatsappAlerts: 0,
            ivrCalls: 0,
            maxTenants: 0,
          },
        isActive:
          singlesubscription?.isActive || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        durationDays: "",
        features: {
          whatsappAlerts: 0,
          ivrCalls: 0,
          maxTenants: 0,
        },
        isActive: true,
      });
    }
  }, [singlesubscription, setFormData]);


  return (
    <div className="space-y-6">

      <Heading
        title={
          id
            ? "Edit Subscription"
            : "Create Subscription"
        }
        paragraph="Manage subscription plans"
        showBack
        backRoute="/subscriptions"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input
            label="Plan Title"
            placeholder="e.g. Premium Plan"
            value={formData.title}
            onChange={(e) =>
              handleChange("title", e.target.value)
            }
            error={errors.title}
          />

          <Input
            label="Price"
            type="number"
            placeholder="e.g. 999"
            value={formData.price}
            onChange={(e) =>
              handleChange("price", e.target.value)
            }
            error={errors.price}
          />

          <Input
            label="Whatsapp Alerts"
            type="number"
            placeholder="e.g. 100"
            value={formData.features?.whatsappAlerts}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  whatsappAlerts: e.target.value,
                },
              }))
            }
            error={errors?.features?.whatsappAlerts}
          />

          <Input
            label="IVR Calls"
            type="number"
            placeholder="e.g. 50"
            value={formData.features?.ivrCalls}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  ivrCalls: e.target.value,
                },
              }))
            }
            error={errors?.features?.ivrCalls}
          />

          <Input
            label="Max Tenants"
            type="number"
            placeholder="e.g. 20"
            value={formData.features?.maxTenants}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  maxTenants: e.target.value,
                },
              }))
            }
            error={errors?.features?.maxTenants}
          />

          <Input
            label="Duration Days"
            type="number"
            placeholder="e.g. 30"
            value={formData.durationDays}
            onChange={(e) =>
              handleChange(
                "durationDays",
                e.target.value
              )
            }
            error={errors.durationDays}
          />
        </div>

        <Input
          label="Description"
          type="textarea"
          placeholder="Write subscription plan details..."
          value={formData.description}
          onChange={(e) =>
            handleChange(
              "description",
              e.target.value
            )
          }
          error={errors.description}
        />

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Additional Settings
          </h3>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleChange(
                      "isActive",
                      e.target.checked
                    )
                  }
                />

                <span className="text-slate-700 text-sm">
                  Active Plan
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                variant="gradient"
                loading={loading}
                disabled={loading}
              >
                {id
                  ? "Update Subscription"
                  : "Save Subscription"}
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  router.push("/subscriptions")
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;