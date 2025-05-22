import React from 'react';
import { fetchSetting } from '@/app/actions/setting/data';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/app/auth';
import DashboardLayout from "../../page";
import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const SystemSetting = dynamic(() => import("@/components/systemSetting/SystemSetting"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Setting",
    description: "Backend Management",
};

const page = async () => {

    const settingVal = await fetchSetting() || {};
    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};
    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.systemSetting
                    ?
                    <>
                        <div className="content-information-wrapper">
                            <div className="inner-information-wrapper">
                                <SystemSetting
                                    settingVal={JSON.parse(JSON.stringify(settingVal))}
                                    authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                                />
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <Unauthorized
                            authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                        />
                    </>
            }
        </DashboardLayout>
    )
}

export default page