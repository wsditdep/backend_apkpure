import React from 'react';
import DashboardLayout from "../../page";
import { fetchContent } from '@/app/actions/mall/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const ContentAction = dynamic(() => import("@/components/formAction/ContentAction"), {
    loading: () => <Loader />
});

const CreateContent = dynamic(() => import("@/components/mall/content/CreateContent"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Announcement",
    description: "Backend Management",
};

const page = async () => {

    const content = await fetchContent() || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.content
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <CreateContent />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Title</th>
                                                <th>Created At</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                content?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.title}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <ContentAction
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