import React from 'react';
import DashboardLayout from "../../page";

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";

const ChangePassword = dynamic(() => import("@/components/changePassword/ChangePassword"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Change Password",
    description: "Backend Management",
};

const page = async ({ params }) => {

    const { id } = params;

    return (
        <DashboardLayout >
            <div className="content-information-wrapper page_animation">
                <div className="inner-information-wrapper">
                    <ChangePassword id={JSON.parse(JSON.stringify(id))} />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default page