import MainLayout from "@/components/templates/MainLayout";
import MainProperties from "@/components/pages/properties/Index"
import React, { Suspense } from "react";

export const metadata = {
  title: "Properties Management",
  description: "Manage and monitor all property listings, rooms, and availability",
};

const page = async ({ searchParams }) => {
  const { page } = await searchParams;
  return (
    <div>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <MainProperties page={page} />
        </Suspense>
      </MainLayout>
    </div>
  );
};

export default page;
