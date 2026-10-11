"use client";

import Button from "./Button";

import {
  Info,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  info: <Info size={30} />,
  delete: <Trash2 size={30} />,
  warning: <AlertTriangle size={30} />,
  success: <CheckCircle2 size={30} />,
};

export const AlertModal = ({
  icon = "info",
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  buttons = [
    {
      text: "Cancel",
      onClick: () => { },
      colorClass:
        "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    {
      text: "Delete",
      onClick: () => { },
      colorClass:
        "bg-red-600 text-white hover:bg-red-700",
    },
  ],
  width = "max-w-md",
  bgColor = "bg-white",

  iconWrapperClass = "bg-blue-100 text-blue-600",
}) => {
  return (
    <div
      className={`mx-auto w-[90%] ${width} rounded-3xl ${bgColor} p-6 shadow-2xl md:w-full md:p-8`}
    >
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconWrapperClass}`}
      >
        {iconMap[icon]}
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {message}
      </p>

      {buttons.length > 0 && (
        <div
          className="mt-6 grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${buttons.length}, 1fr)`,
          }}
        >
          {buttons.map((btn, index) => (
            <Button
              key={index}
              onClick={btn.onClick}
              className={`w-full rounded-xl transition ${btn.colorClass}`}
            >
              {btn.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};