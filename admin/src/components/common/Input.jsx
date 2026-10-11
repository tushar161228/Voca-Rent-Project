"use client";

import clsx from "clsx";
import React, { useState, forwardRef } from "react";

const Input = forwardRef(({
  label,
  labelClass = "",
  className = "",
  iconClass,
  iconEye = false,
  error,
  options = [],
  valueKey,
  labelKey,
  labelRender,
  icon = "",
  onReset,
  ...rest
}, ref) => {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = rest?.type === "password";

  return (
    <div className="flex w-full flex-col gap-1">

      {label && (
        <label
          className={clsx(
            "block text-sm mb-1 text-black font-medium",
            labelClass
          )}
        >
          {label}
        </label>
      )}

      {rest?.type === "textarea" ? (

        <div
          className={clsx(
            "flex w-full rounded-lg",
            error && "border-red-400 ring-2 ring-red-300"
          )}
        >
          {icon && (
            <i className={`${icon} ri-lg text-gray-400`} />
          )}

          <textarea
            className={`w-full min-h-36 max-h-56 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 bg-gray-50 text-slate-700 ${className}`}
            {...rest}
            value={rest.value ?? ""}
          />
        </div>

      ) : rest?.type === "select" ? (

        <div
          className={clsx(
            "flex w-full rounded-lg",
            error && "border-red-400 ring-2 ring-red-300"
          )}
        >
          {icon && (
            <i className={`${icon} ri-lg text-gray-400`} />
          )}

          <select
            {...rest}
            value={rest.value ?? ""}
            className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 bg-gray-50 text-slate-900 line-clip-1"
          >
            {rest?.placeholder && (
              <option value="">
                {rest.placeholder}
              </option>
            )}

            {options.map((opt, idx) => (
              <option
                key={idx}
                value={opt[valueKey] || opt.value || opt}
              >
                {labelRender
                  ? labelRender(opt)
                  : opt[labelKey] || opt.label || opt}
              </option>
            ))}
          </select>
        </div>

      ) : (

        <div
          className={clsx(
            "relative flex items-center gap-2 w-full rounded-lg",
            error && "border-red-400 ring-2 ring-red-300"
          )}
        >
          {icon && (
            <i className={`${icon} ri-lg text-gray-400`} />
          )}

          <input
            ref={ref}
            {...rest}
            value={rest.value ?? ""}
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : rest.type
            }
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 bg-gray-50 text-slate-700 ${className}`}
          />

          {onReset && rest.value && (
            <button
              type="button"
              onClick={onReset}
              className="absolute right-10 text-xs text-red-700 hover:text-red-800 cursor-pointer hover:bg-slate-100 h-5 w-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          )}

          {iconEye && isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="text-gray-500 hover:text-blue-600 cursor-pointer absolute right-3"
            >
              <i
                className={
                  showPassword
                    ? "ri-eye-line ri-lg"
                    : "ri-eye-off-line ri-lg"
                }
              />
            </button>
          )}
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;