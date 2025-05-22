import DashboardLayout from "../../page";
import { fetchMembership } from '@/app/actions/membership/data';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import { fetchAuthenticatedUser } from "@/app/actions/user/data";
import { auth } from "@/app/auth";
import { fetchMenuUserPermission } from "@/app/actions/role/data";
import Unauthorized from "@/components/notFound/Unauthorized";

const CreateMembership = dynamic(() => import("@/components/membership/CreateMembership"), {
    loading: () => <Loader />
});

const CommissionAction = dynamic(() => import("@/components/formAction/CommissionAction"), {
    loading: () => <Loader />
});

const DefaultMembership = dynamic(() => import("@/components/membership/DefaultMembership"), {
    loading: () => <Loader />
});

const page = async () => {

    const membership = await fetchMembership() || [];

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { subPermission } = await fetchMenuUserPermission() || {};

    return (
        <DashboardLayout >
            {
                subPermission?.memberLevel
                    ?
                    <>
                        <div className="content-information-wrapper page_animation">
                            <div className="inner-information-wrapper">
                                <CreateMembership />
                                <div className="global-table responsive-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Default</th>
                                                <th>Commission Rate</th>
                                                <th>Minimum balance</th>
                                                <th>Number of order received</th>
                                                <th>Number of withdrawals</th>
                                                <th>Minimum amount to withdraw</th>
                                                <th>Maximum withdrawal amount</th>
                                                <th></th>
                                                <th>Operation</th>
                                            </tr>
                                            {
                                                membership?.map((data, index) => (
                                                    <tr key={index} className="notranslate">
                                                        <td>{index + 1}</td>
                                                        <td>{data.membership_name}</td>
                                                        <td>
                                                            <DefaultMembership data={JSON.parse(JSON.stringify(data))} />
                                                        </td>
                                                        <td>{data.commission_rate}</td>
                                                        <td>{data.account_balance_limit}</td>
                                                        <td>{data.order_quantity}</td>
                                                        <td>{data.number_of_withdrawal}</td>
                                                        <td>{data.min_withdrawal_amount}</td>
                                                        <td>{data.max_withdrawal_amount}</td>
                                                        <CommissionAction
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