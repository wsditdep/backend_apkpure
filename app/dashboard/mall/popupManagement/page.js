import React from 'react';
import DashboardLayout from "../../page";
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';
import PopManager from '@/components/popup/PopManager';
import { fetchPop } from '@/app/actions/setting/data';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/app/auth';

export const metadata = {
    title: "Control Center - Popup Management",
    description: "Backend Management",
};

const page = async () => {

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const pop = await fetchPop() || {};
    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.notification
                    ?
                    <>
                        <PopManager
                            pop={JSON.parse(JSON.stringify(pop))}
                        />
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

export default page;