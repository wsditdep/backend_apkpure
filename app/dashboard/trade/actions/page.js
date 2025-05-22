import React from 'react';
import DashboardLayout from "../../page";
import { fetchActivities } from '@/app/actions/orders/data';
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

const WithdrawalSearch = dynamic(() => import("@/components/search/WithdrawalSearch"), {
    loading: () => <Loader />
});

const ActionShowJourney = dynamic(() => import("@/components/action/ActionShowJourney"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Orders",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const qphone = searchParams?.qphone || "";
    const page = searchParams?.page || 1;
    const startDate = searchParams?.startDate || "";
    const endDate = searchParams?.endDate || "";
    const limit = searchParams?.limit || 10;

    const { activity, count } = await fetchActivities(q, qphone, page, limit, startDate, endDate) || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.activities
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <WithdrawalSearch />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Track ID</th>
                                                <th>Operation By</th>
                                                <th>Username</th>
                                                <th>Phone Number</th>
                                                <th>Before</th>
                                                <th>After</th>
                                                <th>Type</th>
                                                <th>Created At</th>
                                            </tr>
                                            {
                                                activity?.map((data, index) => {
                                                    const createdTime = moment.tz(data?.createdAt, process.env.TIMWZONE);
                                                    return (
                                                        <tr key={index} className="notranslate">
                                                            <td>{data?._id?.toString().padStart(6, '0').slice(-6)}</td>
                                                            <td>{data?.operationBy}</td>
                                                            <td>{data?.username}</td>
                                                            <td>{data?.phone_number}</td>
                                                            {
                                                                data?.chnageType === "journey"
                                                                    ?
                                                                    <ActionShowJourney data={JSON.parse(JSON.stringify(data))} />
                                                                    :
                                                                    <>
                                                                        <td>{data?.beforeOperation === "" ? "NULL" : data?.beforeOperation}</td>
                                                                        <td>{data?.afterOperation === "" ? "NULL" : data?.afterOperation}</td>
                                                                    </>
                                                            }
                                                            <td>
                                                                <p className="account-action-colors">{
                                                                    data?.chnageType === "withdrawalApprove"
                                                                        ?
                                                                        "Withdrawal Approve"
                                                                        :
                                                                        data?.chnageType === "withdrawalRejected"
                                                                            ?
                                                                            "Withdrawal Rejected"
                                                                            :
                                                                            data?.chnageType === "balance"
                                                                                ?
                                                                                "Account Balance"
                                                                                :
                                                                                data?.chnageType === "frozeAmount"
                                                                                    ?
                                                                                    "Froze Amount"
                                                                                    :
                                                                                    data?.chnageType === "todayCommission"
                                                                                        ?
                                                                                        "Today Commission"
                                                                                        :
                                                                                        data?.chnageType === "walletAddress"
                                                                                            ?
                                                                                            "Wallet Address"
                                                                                            :
                                                                                            data?.chnageType === "walletPhone"
                                                                                                ?
                                                                                                "Wallet Phone"
                                                                                                :
                                                                                                data?.chnageType === "walletName"
                                                                                                    ?
                                                                                                    "Wallet Name"
                                                                                                    :
                                                                                                    data?.chnageType === "walletCurrency"
                                                                                                        ?
                                                                                                        "Currency"
                                                                                                        :
                                                                                                        data?.chnageType === "walletNetwork"
                                                                                                            ?
                                                                                                            "Network Type"
                                                                                                            :
                                                                                                            data?.chnageType === "username"
                                                                                                                ?
                                                                                                                "Username"
                                                                                                                :
                                                                                                                data?.chnageType === "memberlevel"
                                                                                                                    ?
                                                                                                                    "Membership"
                                                                                                                    :
                                                                                                                    data?.chnageType === "parentid"
                                                                                                                        ?
                                                                                                                        "Parent ID"
                                                                                                                        :
                                                                                                                        data?.chnageType === "phone_number"
                                                                                                                            ?
                                                                                                                            "Phone Number"
                                                                                                                            :
                                                                                                                            data?.chnageType === "credibility"
                                                                                                                                ?
                                                                                                                                "Credibility"
                                                                                                                                :
                                                                                                                                data?.chnageType === "min_withdrawal_amount"
                                                                                                                                    ?
                                                                                                                                    "Min Withdrawal" :
                                                                                                                                    data?.chnageType === "max_withdrawal_amount"
                                                                                                                                        ?
                                                                                                                                        "Max Withdrawal"
                                                                                                                                        :
                                                                                                                                        data?.chnageType === "match_min"
                                                                                                                                            ?
                                                                                                                                            "Match Min"
                                                                                                                                            :
                                                                                                                                            data?.chnageType === "match_max"
                                                                                                                                                ?
                                                                                                                                                "Match Max"
                                                                                                                                                :
                                                                                                                                                data?.chnageType === "withdrawal_needed_order"
                                                                                                                                                    ?
                                                                                                                                                    "Withdrawal Needed Order"
                                                                                                                                                    :
                                                                                                                                                    data?.chnageType === "withdrawal_pin"
                                                                                                                                                        ?
                                                                                                                                                        "Withdrawal PIN"
                                                                                                                                                        :
                                                                                                                                                        data?.chnageType === "password"
                                                                                                                                                            ?
                                                                                                                                                            "Password Changed"
                                                                                                                                                            :
                                                                                                                                                            data?.chnageType === "allow_withdrawal"
                                                                                                                                                                ?
                                                                                                                                                                "Allow Withdrawal"
                                                                                                                                                                :
                                                                                                                                                                data?.chnageType === "allow_rob_order"
                                                                                                                                                                    ?
                                                                                                                                                                    "Allow Rob Order"
                                                                                                                                                                    :
                                                                                                                                                                    data?.chnageType === "account_status"
                                                                                                                                                                        ?
                                                                                                                                                                        "Account Status"
                                                                                                                                                                        :
                                                                                                                                                                        data?.chnageType === "reset" ? "Reset"
                                                                                                                                                                            :
                                                                                                                                                                            data?.chnageType === "journey"
                                                                                                                                                                                ?
                                                                                                                                                                                "Journey Ticket"
                                                                                                                                                                                :
                                                                                                                                                                                ""



                                                                }</p>
                                                            </td>
                                                            <td>
                                                                {moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}
                                                                <br />
                                                                ({createdTime.fromNow()})
                                                            </td>
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

export default page