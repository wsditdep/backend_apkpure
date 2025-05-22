import React from 'react';
import DashboardLayout from "../../page";
import { fetchRecharge } from '@/app/actions/recharge/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';
import RemarkAction from '@/components/formAction/RemarkAction';

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const RechargeSearch = dynamic(() => import("@/components/search/RechargeSearch"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Recharge",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const startDate = searchParams?.startDate || "";
    const endDate = searchParams?.endDate || "";
    const limit = searchParams?.limit || 10;

    const { recharge, count } = await fetchRecharge(q, page, startDate, endDate, limit) || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission, permission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.recharge
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <RechargeSearch />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Username</th>
                                                <th>Rechared By</th>
                                                <th>Amount</th>
                                                <th>After Recharge</th>
                                                <th>Recharge Type</th>
                                                {
                                                    permission?.remarks
                                                        ?
                                                        <th>Remark</th>
                                                        :
                                                        <></>
                                                }
                                                <th>Created At</th>
                                                {
                                                    permission?.remarks
                                                        ?
                                                        <>
                                                            <th></th>
                                                            <th>Oparate</th>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                            </tr>
                                            {
                                                recharge?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.username}</td>
                                                        <td>{data?.recharge_by}</td>
                                                        <td>{data?.amount}</td>
                                                        <td>{data?.after_recharge}</td>
                                                        <td className="form-type">
                                                            <p className={data?.recharge_type === "credit" ? "form-type-green" : "form-type-red"}>{data?.recharge_type}</p>
                                                        </td>
                                                        {
                                                            permission?.remarks
                                                                ?
                                                                <td className="review_only">
                                                                    <p>{data?.remark}</p>
                                                                </td>
                                                                :
                                                                <></>
                                                        }
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        {
                                                            permission?.remarks
                                                                ?
                                                                <>
                                                                    <RemarkAction
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