import MainLayout from "@/components/templates/MainLayout";
import SingleRentView from "@/components/pages/view-rents/SingleRentView";

export const metadata = {
  title: "Rent Details",
  description: "View complete rent details and information",
};

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <SingleRentView id={id} />
    </MainLayout>
  );
};

export default page;