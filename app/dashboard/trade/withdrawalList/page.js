import React from 'react';
import DashboardLayout from "../../page";
import { fetchWithdrawal } from '@/app/actions/withdrawal/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import Unauthorized from '@/components/notFound/Unauthorized';
import WithdrawalRemarkAction from '@/components/formAction/WithdrawalRemark';

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const WithdrawalAction = dynamic(() => import("@/components/formAction/WithdrawalAction"), {
    loading: () => <Loader />
});

const WithdrawalSearch = dynamic(() => import("@/components/search/WithdrawalSearch"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Withdrawal List",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {

    const q = searchParams?.q || "";
    const qphone = searchParams?.qphone || "";
    const page = searchParams?.page || 1;
    const startDate = searchParams?.startDate || "";
    const endDate = searchParams?.endDate || "";
    const limit = searchParams?.limit || 10;

    const { subPermission, permission } = await fetchMenuUserPermission() || {};
    const { withdrawal, count } = await fetchWithdrawal(q, qphone, page, startDate, endDate, limit) || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    return (
        <DashboardLayout >
            {
                subPermission?.withdrawal
                    ?
                    <div className="content-information-wrapper page_animation">
                        <div className="inner-information-wrapper">
                            <div className="global-filter-childs">
                                <WithdrawalSearch />
                            </div>
                            <div className="global-table responsive-table">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Username</th>
                                            <th>Phone Number</th>
                                            <th>Withdrawal Amount</th>
                                            <th>Withdrawal Name</th>
                                            <th>Network Type</th>
                                            <th>Currency</th>
                                            <th>Wallet Address</th>
                                            <th>Request Date</th>
                                            <th></th>
                                            <th>Operate</th>
                                            {
                                                permission?.remarks
                                                    ?
                                                    <>
                                                        <th>Remark</th>
                                                        <th></th>
                                                        <th>Action</th>
                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </tr>
                                        {
                                            withdrawal?.map((data, index) => (
                                                <tr key={index} className="notranslate">
                                                    <td>{data?.username}</td>
                                                    <td>{data?.phone_number}</td>
                                                    <td>{data?.withdrawal_amount}</td>
                                                    <td>{data?.wallet_name}</td>
                                                    <td>{data?.network_type}</td>
                                                    <td>{data?.currency}</td>
                                                    <td className="break_word">{data?.wallet_address}</td>
                                                    <td>{moment.tz(data?.wallet_createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                    <WithdrawalAction
                                                        data={JSON.parse(JSON.stringify(data))}
                                                    />
                                                    {
                                                        permission?.remarks
                                                            ?
                                                            <>
                                                                <td className="review_only">{data?.remark}</td>
                                                                <WithdrawalRemarkAction
                                                                    data={JSON.parse(JSON.stringify(data))}
                                                                />
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination count={count} />
                        </div>
                    </div>
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