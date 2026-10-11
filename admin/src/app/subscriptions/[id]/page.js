import SubscriptionFrom from '@/components/pages/subscriptions/SubscriptionFrom';
import MainLayout from '@/components/templates/MainLayout';
import React from 'react';

export const metadata = {
  title: "Update Subscription",
  description: "Update and manage subscription plans",
};

const page =async ({params}) => {
    const {id} = await params;
  return (
    <div>
      <MainLayout>
        <SubscriptionFrom id={id} />
      </MainLayout>
    </div>
  )
}

export default page
