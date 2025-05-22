import React from 'react';
import DashboardLayout from "../../page";
import { fetchOrders } from '@/app/actions/orders/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';
import { auth } from '@/app/auth';

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const WithdrawalSearch = dynamic(() => import("@/components/search/WithdrawalSearch"), {
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

    const { orders, count } = await fetchOrders(q, qphone, page, limit, startDate, endDate) || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.order
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <WithdrawalSearch />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Username</th>
                                                <th>Phone Number</th>
                                                <th>Order Number</th>
                                                <th>Product Name</th>
                                                <th>Product Price</th>
                                                <th>Purchasing Quantity</th>
                                                <th>Order Commission</th>
                                                <th>Order Amount</th>
                                                <th>Created At</th>
                                            </tr>
                                            {
                                                orders?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.order_id}</td>
                                                        <td>{data?.username}</td>
                                                        <td>{data?.phone_number}</td>
                                                        <td>{data?._id?.toString().padStart(6, '0').slice(-6)}</td>
                                                        <td>{data?.product_name}</td>
                                                        <td>{data?.product_price?.toFixed(2) ?? ""}</td>
                                                        <td>{data?.order_quantity}</td>
                                                        <td>{data?.order_commission?.toFixed(2) ?? ""}</td>
                                                        <td>{data?.order_amount?.toFixed(2) ?? ""}</td>
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