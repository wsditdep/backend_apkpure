import DashboardLayout from "../../page";
import { fetchUserInfo, fetchUserJourney } from "@/app/actions/journey/data";

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";

const Journey = dynamic(() => import("@/components/journey/Journey"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Set continuous order",
    description: "Backend Management",
};

const page = async ({ params }) => {

    const { id } = params;

    const user = await fetchUserInfo(id) || {};
    const journey = await fetchUserJourney(id) || {};

    return (
        <DashboardLayout >
            <Journey
                userInfo={JSON.parse(JSON.stringify(user))}
                journeyData={JSON.parse(JSON.stringify(journey))}
            />
        </DashboardLayout>
    )
}

export default page;