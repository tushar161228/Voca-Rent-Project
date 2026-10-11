import Mainsubscription from "@/components/pages/subscriptions/Index";
import MainLayout from "@/components/templates/MainLayout";
import React, { Suspense } from "react";

export const metadata = {
  title: "Subscriptions",
  description: "Manage user subscriptions and plans",
};

const page = async ({ searchParams }) => {
  const { page } = await searchParams;
  return (
    <div>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Mainsubscription page={page} />
        </Suspense>
      </MainLayout>
    </div>
  );
};

export default page;
