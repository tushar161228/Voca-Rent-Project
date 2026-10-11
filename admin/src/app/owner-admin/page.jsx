import MainOwnerAdmin from '@/components/pages/owner-admin/Index';
import MainLayout from '@/components/templates/MainLayout';
import React, { Suspense } from 'react';

export const metadata = {
    title: "Owner Admin",
    description: "Manage and monitor all registered owners and their activities",
};

const page = async ({ searchParams }) => {
    const { page } = await searchParams;
    return (
        <div>
            <MainLayout>
                <Suspense fallback={<div>Loading...</div>}>
                    <MainOwnerAdmin currPage={page} />
                </Suspense>
            </MainLayout>
        </div>
    )
}

export default page
