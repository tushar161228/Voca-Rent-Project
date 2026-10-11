"use client";
import BasicTable from "@/components/common/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchcustomer } from "@/components/redux/slice/customer-slice";
import Heading from "@/components/atoms/Heading";
import { useRouter } from "next/navigation";
import SearchBox from "@/components/atoms/SearchBox";
import { useSearchParams } from "next/navigation";

const MainCustomers = ({ currPage }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const propertyId = searchParams.get("propertyId") || "";
  const { customerList, documentCount } = useSelector((s) => s.customer);

  const actions = [
    ({ row }) => (
      <div className="flex items-center gap-3">
        <i
          className="ri-eye-line text-lg text-slate-500 cursor-pointer"
          onClick={() => router.push(`/customers/${row?._id}`)}
        />
      </div>
    ),
  ];


  useEffect(() => {
    dispatch(
      fetchcustomer({
        filters: {
          page: currPage,
          limit: 6,
          search,
          propertyId
        },
      })
    );
  }, [dispatch, currPage, search, propertyId]);

  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="w-full">
          <Heading
            title="Customer Management"
            paragraph="View and manage all customers in one place"
          />
        </div>
        <div className="md:w-8/12 w-full">
          <SearchBox
            placeholder="Search customers by name, aadhar, or phone"
            iconLeft={true}
            value={search}
            name="search"
            type="text"
          />
        </div>
      </div>

      <div className="mt-5">
        <BasicTable
          columns={columns(currPage)}
          data={customerList || []}
          pagination={true}
          total={documentCount || 0}
          pageSize={6}
          actions={actions}
          actionClass="uppercase"
          actionText={false}
        />
      </div>
    </>
  );
};

export default MainCustomers;


const pageSize = 6;

const columns = (currPage) => [
  {
    label: "S.NO",
    key: "index",
    render: (_, __, index) => {
      const page = Number(currPage) || 1;
      return (page - 1) * pageSize + index + 1;
    },
  },
  {
    label: "CUSTOMER NAME",
    key: "name",
    render: (name) => (
      <div className="font-semibold text-gray-800">
        {name || "-"}
      </div>
    ),
  },
  {
    label: "FATHER NAME",
    key: "fatherName",
    render: (fatherName) => (
      <span className="text-[#667085]">
        {fatherName || "-"}
      </span>
    ),
  },
  {
    label: "EMAIL",
    key: "email",
    render: (email) => (
      <span className="text-[#667085]">
        {email || "-"}
      </span>
    ),
  },
  {
    label: "PHONE",
    key: "mobile",
    render: (mobile) => (
      <span className="text-[#667085]">
        {mobile || "-"}
      </span>
    ),
  },
  {
    label: "AADHAR",
    key: "aadhar",
    render: (aadhar) => (
      <span className="text-[#667085]">
        {aadhar || "-"}
      </span>
    ),
  },
  {
    label: "ADDRESS",
    key: "address",
    render: (address) => (
      <span className="text-[#667085]">
        {address || "-"}
      </span>
    ),
  },
];