import MainLayout from "@/components/templates/MainLayout";
import MainPayments from "@/components/pages/payments/Index";
import React, { Suspense } from "react";

export const metadata = {
  title: "Payment Management",
  description: "Manage and track all payment records, transactions, and billing details",
};

const page = async ({ searchParams }) => {
  const { page } = await searchParams;
  return (
    <div>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <MainPayments page={page} />
        </Suspense>
      </MainLayout>
    </div>
  );
};

export default page;
