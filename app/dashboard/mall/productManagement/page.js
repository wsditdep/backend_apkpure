import React from 'react';
import DashboardLayout from "../../page";
import { fetchProducts } from '@/app/actions/product/data';
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/app/auth';
import { fetchMenuUserPermission } from '@/app/actions/role/data';
import Unauthorized from '@/components/notFound/Unauthorized';

const ProductAction = dynamic(() => import("@/components/formAction/ProductAction"), {
    loading: () => <Loader />
});

const Search = dynamic(() => import("@/components/users/Search"), {
    loading: () => <Loader />
});

const Pagination = dynamic(() => import("@/components/pagination/Pagination"), {
    loading: () => <Loader />
});

const CreateProduct = dynamic(() => import("@/components/product/CreateProduct"), {
    loading: () => <Loader />
});

const ProductFilter = dynamic(() => import("@/components/product/ProductFilter"), {
    loading: () => <Loader />
});

export const metadata = {
    title: "Control Center - Products",
    description: "Backend Management",
};

const page = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const sortByPrice = searchParams?.sortByPrice || "";
    const limit = searchParams?.limit || 10;

    const { products, count } = await fetchProducts(q, page, sortByPrice, limit);
    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.product
                    ?
                    <>
                        <div className="content-information-wrapper">
                            <div className="inner-information-wrapper">
                                <div className="global-filter-wrapper">
                                    <div className="global-filter-childs">
                                        <Search
                                            authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                                        />
                                    </div>
                                    <div className="global-filter-childs">
                                        <ProductFilter />
                                    </div>
                                </div>
                                <CreateProduct />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Store Name</th>
                                                <th>Product Price</th>
                                                <th>Created At</th>
                                                <th></th>
                                                <th>Operate</th>
                                            </tr>
                                            {
                                                products?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{data?.productName}</td>
                                                        <td>{data?.storeName}</td>
                                                        <td>{data?.productPrice}</td>
                                                        <td>{moment.tz(data?.createdAt, process.env.TIMWZONE).format('YYYY-MM-DD, HH:mm:ss')}</td>
                                                        <ProductAction
                                                            data={JSON.parse(JSON.stringify(data))}
                                                        />
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