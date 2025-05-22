import React from 'react';
import DashboardLayout from "../../page";
import { fetchMembership } from '@/app/actions/membership/data';
import { fetchAgent, fetchAuthenticatedUser } from '@/app/actions/user/data';
import { UserAction } from '@/components/formAction/UserAction';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import Unauthorized from '@/components/notFound/Unauthorized';

const CreateUser = dynamic(() => import("@/components/agent/CreateAgent"), {
    loading: () => <Loader />
});

const UserSearch = dynamic(() => import("@/components/users/UserSearch"), {
    loading: () => <Loader />
});

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const BlockUser = dynamic(() => import("@/components/users/BlockUser"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Agents",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {

    const q = searchParams?.q || "";
    const qphone = searchParams?.qphone || "";
    const page = searchParams?.page || 1;
    const startDate = searchParams?.startDate || "";
    const endDate = searchParams?.endDate || "";
    const limit = searchParams?.limit || 10;

    const { permission, subPermission } = await fetchMenuUserPermission() || {};

    const membership = await fetchMembership();
    const { users, count } = await fetchAgent(q, qphone, page, startDate, endDate, limit);

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    return (
        <DashboardLayout >
            {
                subPermission?.agentManagement
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <UserSearch />
                                <CreateUser />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th className="sticky-left-props">ID</th>
                                                <th>Username</th>
                                                <th>Superior ID</th>
                                                <th>Phone Number</th>
                                                <th>Balance</th>
                                                <th>Available for daily order</th>
                                                <th>Taking orders today</th>
                                                <th>Today's commission</th>
                                                <th>Credibility</th>
                                                <th>Superior user</th>
                                                <th>Invitation code</th>
                                                <th>Status</th>
                                                <th>Membership Level</th>
                                                <th>Frozen Amount</th>
                                                <th>Registration time</th>
                                                <th>Last login time</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                users?.map((data, index) => {
                                                    const reversedIndex = users.length - 1 - index;
                                                    return (
                                                        <tr key={index} className="notranslate">
                                                            <td className="sticky-left-props">{data.id}</td>
                                                            <td>{data.username}</td>
                                                            <td>{data.parent_id}</td>
                                                            <td>{data.phone_number}</td>
                                                            <td className={data?.balance < 0 ? "negative_balance" : ""}>{data?.balance?.toFixed(2) ?? ""}</td>
                                                            <td>{data.daily_available_order}</td>
                                                            <td>{data.today_order}</td>
                                                            <td>{data?.today_commission?.toFixed(2) ?? ""}</td>
                                                            <td>{data.credibility}</td>
                                                            <td>{data.parent_user}</td>
                                                            <td>{data.invitation_code}</td>
                                                            <td>
                                                                <BlockUser data={JSON.parse(JSON.stringify(data))} />
                                                            </td>
                                                            <td>{data.membership_level}</td>
                                                            <td>{data.froze_amount}</td>
                                                            <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                            <td>{moment.tz(data?.last_login, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                            {
                                                                data?.username === "default"
                                                                    ?
                                                                    <></>
                                                                    :
                                                                    <UserAction
                                                                        membership={JSON.parse(JSON.stringify(membership))}
                                                                        data={JSON.parse(JSON.stringify(data))}
                                                                        index={JSON.parse(JSON.stringify(reversedIndex))}
                                                                        permission={JSON.parse(JSON.stringify(permission))}
                                                                        subPermission={JSON.parse(JSON.stringify(subPermission))}
                                                                    />

                                                            }
                                                        </tr>
                                                    )
                                                })
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

export default page;