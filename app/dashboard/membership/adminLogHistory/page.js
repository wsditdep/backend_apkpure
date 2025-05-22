import React from 'react';
import DashboardLayout from "../../page";
import { fetchAdminLoginHistory } from '@/app/actions/membership/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const LoginHistorySearch = dynamic(() => import("@/components/search/LoginHistorySearch"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - System User Log History",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {

    const q = searchParams?.q || "";
    const qphone = searchParams?.qphone || "";
    const ip = searchParams?.ip || "";
    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 10;

    const { logs, count } = await fetchAdminLoginHistory(q, qphone, ip, page, limit);

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.systemAccess
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <div className="global-filter-wrapper">
                                    <div className="global-filter-childs">
                                        <LoginHistorySearch />
                                    </div>
                                    <div className="global-filter-childs">

                                    </div>
                                </div>
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Log ID</th>
                                                <th>Username</th>
                                                <th>Phone Number</th>
                                                <th>IP Address</th>
                                                <th>Country</th>
                                                <th>City</th>
                                                <th>Region Name</th>
                                                <th>Device</th>
                                                <th>OS</th>
                                                <th>Browser</th>
                                                <th>Previous Login</th>
                                                <th>New Login</th>                                                
                                                <th>Domain</th>
                                                <th>Time</th>
                                            </tr>
                                            {
                                                logs?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{data.username ?? "NULL"}</td>
                                                        <td>{data.phone_number ?? "NULL"}</td>
                                                        <td>{data.ip_address ?? "NULL"}</td>
                                                        <td>{data.country_name ?? "NULL"}</td>
                                                        <td>{data.city_name ?? "NULL"}</td>
                                                        <td>{data.region_name ?? "NULL"}</td>
                                                        <td>{data.device_type ?? "NULL"}</td>
                                                        <td>{data.os ?? "NULL"}</td>
                                                        <td>{data.browser ?? "NULL"}</td>
                                                        <td>{data.device_id_old ?? "NULL"}</td>
                                                        <td>{data.device_id_new ?? "NULL"}</td>
                                                        <td>{data.domain ?? "NULL"}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
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