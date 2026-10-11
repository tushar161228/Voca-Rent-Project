"use client";
import clsx from "clsx";
import Pagination from "../common/Pagination";
import DataNotFound from "../atoms/DataNotFound";


const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const BasicTable = ({
  bordered = true,
  columns,
  data,
  actions,
  total = 100,
  pageSize = 10,
  pagination,
  wrapperClassName,
  actionClass = "",
  actionText = true,
  theadClassName = "text-[11px]",
}) => {
  return (
    <>
      <div
        className={clsx(
          "w-full overflow-x-auto  scroll-container",
          bordered && "create-s-border",
          wrapperClassName ?? "rounded-lg md:rounded-xl lg:rounded-2xl"
        )}
      >
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-blue-50/20">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-4 md:px-6 py-4 md:py-6 text-left whitespace-nowrap font-semibold  text-slate-500 ${theadClassName}`}
                >
                  {col.label}
                </th>
              ))}

              {actions && (
                <th className={`px-4 md:px-6 py-4 text-left capitalize whitespace-nowrap font-inter font-semibold text-[11px] text-slate-500 ${actionClass}`}>
                  {actionText ? "Actions" : "view"}
                </th>
              )}
            </tr>
          </thead>
          <tbody>

            {data.length > 0 ? (

              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >

                  {columns.map((col, index) => {
                    const rawValue = getNestedValue(row, col.key);

                    const value = col.render
                      ? col.render(rawValue, row, rowIndex)
                      : rawValue ?? "-";

                    return (
                      <td
                        key={index}
                        className="px-4 md:px-6 py-4 whitespace-nowrap font-normal text-[13px] font-medium text-slate-600"
                      >
                        {value}
                      </td>
                    );
                  })}

                  {actions && (
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        {actions.map((Action, i) => (
                          <Action key={i} row={row} />
                        ))}
                      </div>
                    </td>
                  )}

                </tr>
              ))

            ) : (

              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-10"
                >
                  <DataNotFound />
                </td>
              </tr>

            )}

          </tbody>
        </table>


      </div>
      {pagination && (
        <div className="p-4 border-t  flex justify-end border-gray-200">
          <Pagination pageSize={pageSize} total={total} />
        </div>
      )}
    </>
  );
};

export default BasicTable;
