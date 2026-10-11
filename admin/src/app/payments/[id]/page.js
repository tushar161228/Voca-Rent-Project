import MainLayout from "@/components/templates/MainLayout";
import SinglePaymentHistory from "@/components/pages/payments/SinglePaymentHistory";

export const metadata = {
  title: "Payment History",
  description: "View complete payment history and transaction details",
};

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <SinglePaymentHistory id={id} />
    </MainLayout>
  );
};

export default page;