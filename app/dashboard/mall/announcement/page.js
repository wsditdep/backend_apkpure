import React from 'react';
import DashboardLayout from "../../page";
import { fetchNotice } from '@/app/actions/mall/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/app/auth';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const AnnouncementAction = dynamic(() => import("@/components/formAction/AnnouncementAction"), {
    loading: () => <Loader />
});

const CreateAnnouncement = dynamic(() => import("@/components/mall/announcement/CreateAnnouncement"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Announcement",
    description: "Backend Management",
};

const page = async () => {

    const notice = await fetchNotice() || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.announcement
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                {
                                    notice?.length === 0
                                        ?
                                        <CreateAnnouncement />
                                        :
                                        <></>
                                }
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Created At</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                notice?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.notice_name}</td>
                                                        <td>{data?.notice}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <AnnouncementAction
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