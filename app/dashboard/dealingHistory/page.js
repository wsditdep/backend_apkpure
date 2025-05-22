import React from 'react';
import DashboardLayout from "@/app/dashboard/page";
import { fetchDealingHistory } from '@/app/actions/history/data';
import DealingFilter from '@/components/product/DealingFilter';
import Unauthorized from '@/components/notFound/Unauthorized';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import { auth } from '@/app/auth';
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import moment from 'moment';
import 'moment-timezone';

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Control Center - Dealing History",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const sortByType = searchParams?.sortByType || "";

    const { history } = await fetchDealingHistory(q, sortByType) || [];
    const { subPermission } = await fetchMenuUserPermission() || {};

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    return (
        <DashboardLayout >
            {
                subPermission?.dealingHistory
                    ?
                    <div className="content-information-wrapper">
                        <div className="inner-information-wrapper">
                            <div className="global-filter-wrapper">
                                <div className="global-filter-childs">
                                    <h3 className="history_management_heading">Dealing History</h3>
                                </div>
                                <div className="global-filter-childs">
                                    <DealingFilter />
                                </div>
                            </div>
                            <div className="global-table responsive-table">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <th>Product Name</th>
                                            <th>Price</th>
                                            <th>Ticket</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                        </tr>
                                        {
                                            history?.map((data, index) => {
                                                const createdTime = moment.tz(data?.createdAt, process.env.TIMWZONE);

                                                return (
                                                    <tr key={index} className={data?.isJourneyProduct ? "dealing_history_red notranslate" : "notranslate"}>
                                                        <td>{data?._id?.toString().padStart(6, '0').slice(-6)}</td>
                                                        <td>{data?.productName}</td>
                                                        <td>{data?.productPrice}</td>
                                                        <td>{data?.isJourneyProduct ? `Ticket - ${data?.stage}` : "--"}</td>
                                                        <td><p className={data?.status === "completed" ? "tags-green" : "tags-red"}>{data?.status}</p></td>
                                                        <td>
                                                            {createdTime.format('YYYY-MM-DD, HH:mm:ss')}
                                                            <br />
                                                            ({createdTime.fromNow()})
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
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