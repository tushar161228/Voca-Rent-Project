import MainLayout from '@/components/templates/MainLayout';
import CreateAdmin from '@/components/pages/owner-admin/CreateAdmin';
import React from 'react';

export const metadata = {
  title: "Create Admin",
  description: "Create and manage admin users",
};

const page = () => {
  return (
    <div>
      <MainLayout>
        <CreateAdmin />
      </MainLayout>
    </div>
  )
}

export default page
