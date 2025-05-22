import Analytics from "@/components/analytics/Analytics";
import DashboardLayout from "@/app/dashboard/page";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Control Center - Welcome",
    description: "Backend Management",
};

const page = () => {
    return (
        <>
            <DashboardLayout>
                <Analytics />
            </DashboardLayout>
        </>
    )
}

export default page;