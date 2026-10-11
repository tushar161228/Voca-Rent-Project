import SubscriptionFrom from '@/components/pages/subscriptions/SubscriptionFrom';
import MainLayout from '@/components/templates/MainLayout';
import React from 'react';

export const metadata = {
  title: "Create Subscription",
  description: "Create and manage subscription plans",
};

const page = () => {
  return (
    <div>
      <MainLayout>
        <SubscriptionFrom />
      </MainLayout>
    </div>
  )
}

export default page
