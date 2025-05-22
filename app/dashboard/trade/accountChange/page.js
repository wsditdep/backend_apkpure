import React from 'react';
import DashboardLayout from "../../page";
import { fetchAccountChange } from '@/app/actions/accountChange/data';
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

const AccountChangeFilter = dynamic(() => import("@/components/accountChange/AccountChangeFilter"), {
    loading: () => <Loader />
});

const RechargeSearch = dynamic(() => import("@/components/search/RechargeSearch"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Orders",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const qphone = searchParams?.qphone || "";
    const startDate = searchParams?.startDate || "";
    const endDate = searchParams?.endDate || "";
    const limit = searchParams?.limit || 10;
    const sortByType = searchParams?.sortByType || "";

    const { accounts, count, totalAmount, totalAmountAfterOperation } = await fetchAccountChange(q, qphone, page, startDate, endDate, limit, sortByType) || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.accountChange
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <div className="global-filter-wrapper">
                                    <div className="global-filter-childs">
                                        <RechargeSearch />
                                    </div>
                                    <div className="global-filter-childs">
                                        <AccountChangeFilter />
                                    </div>
                                </div>
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Username</th>
                                                <th>Phone Number</th>
                                                <th>Amount</th>
                                                <th>Amount After Operation</th>
                                                <th>Type</th>
                                                <th>Created At</th>
                                            </tr>
                                            {
                                                accounts?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.username}</td>
                                                        <td>{data?.phone_number}</td>
                                                        <td>{data?.amount?.toFixed(2) ?? 0}</td>
                                                        <td>{data?.after_operation?.toFixed(2) ?? 0}</td>
                                                        <td className="form-type">
                                                            <p className={
                                                                data?.account_type === "orderCommission" ? "form-type-cyan"
                                                                    :
                                                                    data?.account_type === "withdrawal" ? "form-type-orange"
                                                                        :
                                                                        data?.account_type === "credit" ? "form-type-green"
                                                                            :
                                                                            data?.account_type === "registrationGift" ? "form-type-moroon"
                                                                                :
                                                                                data?.account_type === "upperUserCommission" ? "form-type-blue"
                                                                                    :
                                                                                    data?.account_type === "withdrawalApprove" ? "form-type-green"
                                                                                        :
                                                                                        data?.account_type === "withdrawalReject" ? "form-type-red"
                                                                                            :
                                                                                            data?.account_type === "frozeAmount" ? "form-type-blue"
                                                                                                :
                                                                                                data?.account_type === "transaction" ? "form-type-green"
                                                                                                    :
                                                                                                    data?.account_type === "draw" ? "form-type-blue"
                                                                                                        :
                                                                                                        "form-type-red"
                                                            }>
                                                                {
                                                                    data?.account_type === "orderCommission" ? "Order Commission"
                                                                        :
                                                                        data?.account_type === "withdrawal" ? "Withdrawal"
                                                                            :
                                                                            data?.account_type === "credit" ? "Credit"
                                                                                :
                                                                                data?.account_type === "registrationGift" ? "Registration Gift"
                                                                                    :
                                                                                    data?.account_type === "upperUserCommission" ? "Upper Level Commission"
                                                                                        :
                                                                                        data?.account_type === "withdrawalApprove" ? "Withdrawal Approved"
                                                                                            :
                                                                                            data?.account_type === "withdrawalReject" ? "Withdrawal Rejected"
                                                                                                :
                                                                                                data?.account_type === "frozeAmount" ? "Froze Amount"
                                                                                                    :
                                                                                                    data?.account_type === "transaction" ? "Transaction"
                                                                                                        :
                                                                                                        data?.account_type === "draw" ? "Lucky Draw"
                                                                                                            :
                                                                                                            "Debit"
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                    </tr>
                                                ))
                                            }
                                            <tr className="account_change_wrapper">
                                                <td>Total</td>
                                                <td className="account_change_result"></td>
                                                <td className="account_change_result">{totalAmount?.toFixed(2) ?? 0}</td>
                                                <td className="account_change_result">{totalAmountAfterOperation?.toFixed(2) ?? 0}</td>
                                                <td className="account_change_result"></td>
                                                <td className="account_change_result"></td>
                                                <td className="account_change_result"></td>
                                            </tr>
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