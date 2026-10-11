import MainLayout from "@/components/templates/MainLayout";
import SingleOwnerAdmin from "@/components/pages/owner-admin/SingleOwnerAdmin";

export const metadata = {
  title: "Owner Details",
  description: "View complete owner details and information",
};

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <SingleOwnerAdmin id={id} />
    </MainLayout>
  );
};

export default page;