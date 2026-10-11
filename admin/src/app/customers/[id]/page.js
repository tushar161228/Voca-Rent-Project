import MainLayout from "@/components/templates/MainLayout";
import SingleCustomerView from "@/components/pages/customers/SingleCustomerView";

export const metadata = {
  title: "Customer Details",
  description: "View complete customer details and information",
};

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <SingleCustomerView id={id} />
    </MainLayout>
  );
};

export default page;