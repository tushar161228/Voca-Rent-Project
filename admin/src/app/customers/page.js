import MainCustomers from '@/components/pages/customers/Index';
import MainLayout from '@/components/templates/MainLayout';
import React, { Suspense } from 'react';

export const metadata = {
  title: "Customer Management",
  description: "Manage and monitor all registered customers and their activities",
};

const page = async ({ searchParams }) => {
  const { page } = await searchParams;
  return (
    <div>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <MainCustomers currPage={page} />
        </Suspense>
      </MainLayout>
    </div>
  )
}

export default page
