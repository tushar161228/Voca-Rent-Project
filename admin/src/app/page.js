import MainDashboard from "@/components/pages/dashboard/Index";
import MainLayout from "@/components/templates/MainLayout";

export const metadata = {
  title: 'Dashboard',
  description: 'Welcome to your main dashboard',
};

export default function Home() {
  return (
    <MainLayout>
      <MainDashboard />
    </MainLayout>
  );
}