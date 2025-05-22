import React from 'react';
import DashboardLayout from "../../page";
import { fetchSupport } from '@/app/actions/setting/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const SupportAction = dynamic(() => import("@/components/systemManagement/support/SupportAction"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Customer Service",
    description: "Backend Management",
};

const page = async () => {

    const support = await fetchSupport() || {};

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.customerSupport
                    ?
                    <>
                        <div className="content-information-wrapper page_amimation">
                            <div className="inner-information-wrapper">
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Mobile Number</th>
                                                <th>LiveChat</th>
                                                <th>WeChat</th>
                                                <th>Link</th>
                                                <th>Work Time</th>
                                                <th>Created At</th>
                                                <th>Updated At</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                support?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.mobile_number}</td>
                                                        <td>{data?.live_chat}</td>
                                                        <td>{data?.we_chat}</td>
                                                        <td>{data?.link}</td>
                                                        <td>{data?.work_time}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <td>{moment.tz(data?.updatedAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <SupportAction
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