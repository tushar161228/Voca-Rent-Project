import MainLayout from "@/components/templates/MainLayout";
import MainProfile from "@/components/pages/profile";
export const metadata = {
    title: "Profile",
    description: "View and manage your profile",
};

const page = () => {
    return (
        <div>
            <MainLayout>
                <MainProfile />
            </MainLayout>
        </div>
    )
}

export default page
