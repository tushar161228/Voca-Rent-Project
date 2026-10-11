"use client";

import React from "react";
import {
  MessageCircle,
  Phone,
  Building2,
  BarChart3,
} from "lucide-react";

import Button from "../common/Button";
import Badge from "../common/Badge";

const SubscriptionCard = ({
  title,
  description,
  price,
  durationDays,
  features = {},
  isActive,
  href,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1 transition-all duration-300">

      <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <Badge
            text={isActive ? "Active" : "Closed"}
          />
        </div>

        <h1 className="text-4xl font-bold mt-5">
          ₹{price}
        </h1>

        <p className="mt-2 text-sm text-slate-100">
          {durationDays} Days Plan
        </p>
      </div>

      <div className="p-6">

        <p className="text-sm text-slate-600 leading-6 line-clamp-2">
          {description}
        </p>

        <div className="space-y-4 mt-6">

          <div className="flex items-center gap-3">
            <MessageCircle
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm text-slate-700">
              Whatsapp Alerts :
              <span className="font-semibold ml-1">
                {features?.whatsappAlerts || 0}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Phone
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm text-slate-700">
              IVR Calls :
              <span className="font-semibold ml-1">
                {features?.ivrCalls || 0}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Building2
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm text-slate-700">
              Max Tenants :
              <span className="font-semibold ml-1">
                {features?.maxTenants || 0}
              </span>
            </span>
          </div>

        </div>

        <div className="flex items-center gap-3 mt-8">
          <Button
            href={href}
            className="w-full"
            icon="edit-line"
          >
            Edit
          </Button>

          <Button
            onClick={onDelete}
            className="w-full text-red-500 hover:bg-red-50"
            icon="delete-bin-line"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;