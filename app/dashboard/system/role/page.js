import React from 'react';
import DashboardLayout from "../../page";
import { fetchMenuUserPermission, fetchRoles } from '@/app/actions/role/data';
import moment from 'moment';
import 'moment-timezone';

import Unauthorized from '@/components/notFound/Unauthorized';
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";

const RoleAction = dynamic(() => import("@/components/systemManagement/role/RoleAction"), {
    loading: () => <Loader />
});

const CreateRole = dynamic(() => import("@/components/systemManagement/role/CreateRole"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Role Management",
    description: "Backend Management",
};

const page = async () => {

    const roles = await fetchRoles() || [];
    
    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};
    
    const { subPermission } = await fetchMenuUserPermission() || {};
    
    return (
        <DashboardLayout >
            {
                subPermission?.roleManagement
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <CreateRole />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>ID</th>
                                                <th>Role Name</th>
                                                <th>Created At</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                roles?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{index + 1}</td>
                                                        <td>{data?.role_name ?? ""}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <RoleAction
                                                            data={JSON.parse(JSON.stringify(data))}
                                                        />
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
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