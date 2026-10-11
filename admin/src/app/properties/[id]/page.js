import SinglePropertyView from "@/components/pages/properties/SinglePropertyView";
import MainLayout from "@/components/templates/MainLayout";

export const metadata = {
  title: "Property Details",
  description: "View complete property details and information",
};

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <SinglePropertyView id={id} />
    </MainLayout>
  );
};

export default page;