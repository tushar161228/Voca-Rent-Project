import MainTrade from "@/components/pages/view-rents/Index";
import MainLayout from "@/components/templates/MainLayout";
import React, { Suspense } from "react";

export const metadata = {
  title: "Rent Management",
  description: "Manage and track all rent payments, tenants, and rental records",
};

const page = async ({ searchParams }) => {
  const { page } = await searchParams;
  return (
    <div>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <MainTrade page={page} />
        </Suspense>
      </MainLayout>
    </div>
  );
};

export default page;
