import React from 'react';
import DashboardLayout from "../../page";
import { fetchAllAgent, fetchAuthenticatedUser, fetchSystemUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission, fetchRoles } from '@/app/actions/role/data';
import { fetchMembership } from '@/app/actions/membership/data';
import moment from 'moment';
import 'moment-timezone';
import { auth } from '@/app/auth';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";

const CreateSystemUser = dynamic(() => import("@/components/systemManagement/systemUser/CreateSystemUser"), {
    loading: () => <Loader />
});

const SystemUserAction = dynamic(() => import("@/components/formAction/SystemUserAction"), {
    loading: () => <Loader />
});

const Search = dynamic(() => import("@/components/users/Search"), {
    loading: () => <Loader />
});

const BlockUser = dynamic(() => import("@/components/users/BlockUser"), {
    loading: () => <Loader />
});

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - System User",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {

    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 10;

    const membership = await fetchMembership() || "";
    const agents = await fetchAllAgent() || [];
    const roles = await fetchRoles() || [];

    const { users, count } = await fetchSystemUser(q, page, limit);

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.systemUser
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <Search
                                    authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                                />
                                <CreateSystemUser
                                    agents={JSON.parse(JSON.stringify(agents))}
                                    roles={JSON.parse(JSON.stringify(roles))}
                                    authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                                />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>{authenticatedUser?.language === "en" ? "Username" : "用户名"}</th>
                                                <th>{authenticatedUser?.language === "en" ? "Role" : "角色"}</th>
                                                <th>{authenticatedUser?.language === "en" ? "Created At" : "创建于"}</th>
                                                <th>{authenticatedUser?.language === "en" ? "Status" : "地位"}</th>
                                                <th></th>
                                                <th>{authenticatedUser?.language === "en" ? "Operate" : "操作"}</th>
                                            </tr>
                                            {
                                                users?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.agent_username}</td>
                                                        <td>{data?.role}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <td>
                                                            <BlockUser data={JSON.parse(JSON.stringify(data))} />
                                                        </td>
                                                        <SystemUserAction
                                                            data={JSON.parse(JSON.stringify(data))}
                                                            membership={JSON.parse(JSON.stringify(membership))}
                                                            agents={JSON.parse(JSON.stringify(agents))}
                                                            roles={JSON.parse(JSON.stringify(roles))}
                                                            authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                                                        />
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination count={count} />
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