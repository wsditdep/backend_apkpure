import { auth } from "../auth";
import { fetchWithdrawalCount } from '../actions/withdrawal/data';
import { fetchAuthenticatedUser } from '../actions/user/data';
import { fetchMenuUserPermission } from '../actions/role/data';
import { fetchSetting } from '../actions/setting/data';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import SideBar from "@/components/layout/SideBar";
import SecondaryBar from "@/components/layout/SecondaryBar";

const NavigationTab = dynamic(() => import("@/components/navigationTab/NavigationTab"), {
    loading: () => <Loader />
});

const page = async ({ children }) => {

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};
    const withdrawalCount = await fetchWithdrawalCount() || 0;
    const { permission, subPermission } = await fetchMenuUserPermission() || {};
    const settingVal = await fetchSetting() || {}

    return (
        <div className="app_layout">
            <div className="app-layout-parent">
                <div className="app-layout-child">
                    <SideBar
                        user={JSON.parse(JSON.stringify(user))}
                        subPermission={JSON.parse(JSON.stringify(subPermission))}
                        authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                    />
                </div>
                <div className="app-layout-child">
                    <SecondaryBar
                        user={JSON.parse(JSON.stringify(user))}
                        withdrawalCount={JSON.parse(JSON.stringify(withdrawalCount))}
                        authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                        permission={JSON.parse(JSON.stringify(permission))}
                        subPermission={JSON.parse(JSON.stringify(subPermission))}
                        settingVal={JSON.parse(JSON.stringify(settingVal))}
                    />
                    <NavigationTab
                        authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                    />
                    {children}
                </div>
            </div>            
        </div>
    )
}

export default page;