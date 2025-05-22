"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateRole } from "@/app/actions/role/action";
import toast from "react-hot-toast";

function Submit({ setShowModal }) {
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? "" : (
                <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
            )}
            <button
                type="submit"
                className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}
            >
                {pending ? <>Please wait <i className="fa fa-circle-notch rotating-spinner"></i></> : `Update`}
            </button>
        </>
    );
}

const UpdateRole = ({ data, setIsUpdate }) => {
    const router = useRouter();

    const [isAllShow, setIsAllShow] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const [selectedPermissions, setSelectedPermissions] = useState({
        frontPage: false,
        systemManagement: false,
        mallManagement: false,
        memberManagement: false,
        tradeManagement: false,
        accessAllClient: false,
        moreActions: false,
        setUpOrder: false,
        creditDebit: false,
        resetOrderQuantity: false,
        remarks: false
    });

    const [selectedSubPermissions, setSelectedSubPermissions] = useState({
        analytics: false,
        systemSetting: false,
        systemUser: false,
        roleManagement: false,
        customerSupport: false,
        memberManagement: false,
        announcement: false,
        content: false,
        product: false,
        notification: false,
        memberList: false,
        memberLevel: false,
        agentManagement: false,
        loginHistory: false,
        systemAccess: false,
        withdrawal: false,
        order: false,
        accountChange: false,
        recharge: false,
        activities: false,
        walletInfo: false,
        edit: false,
        accountChangeMenu: false,
        dealingHistory: false,
    });

    const [openMenus, setOpenMenus] = useState({
        frontPage: false,
        systemManagement: false,
        mallManagement: false,
        memberManagement: false,
        tradeManagement: false,
        moreActions: false,
    });

    const toggleDropdown = (menu) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    const handleExpandAll = (val) => {
        const showAll = val === "showAll";
        setIsAllShow(showAll);
        setOpenMenus({
            frontPage: showAll,
            systemManagement: showAll,
            mallManagement: showAll,
            memberManagement: showAll,
            tradeManagement: showAll,
            moreActions: showAll,
        });
    };

    const handleSelectAll = () => {
        const newSelectionState = !isAllSelected;

        setIsAllSelected(newSelectionState);

        const updatedPermissions = Object.keys(selectedPermissions).reduce((acc, key) => {
            acc[key] = newSelectionState;
            return acc;

        }, {});
        setSelectedPermissions(updatedPermissions);

        const updatedSubPermissions = Object.keys(selectedSubPermissions).reduce((acc, key) => {
            acc[key] = newSelectionState;
            return acc;
        }, {});
        setSelectedSubPermissions(updatedSubPermissions);
    };

    const handleCheckboxChange = (permission) => {
        setSelectedPermissions((prevState) => ({
            ...prevState,
            [permission]: !prevState[permission],
        }));
    };

    const handleCheckboxChangeAlt = (permission) => {
        setSelectedSubPermissions((prevState) => ({
            ...prevState,
            [permission]: !prevState[permission],
        }));
    };

    const handleForm = async (formData) => {

        try {
            formData.append("menu_permission", JSON.stringify(selectedPermissions));
            formData.append("menu_sub_permission", JSON.stringify(selectedSubPermissions));
            const response = await updateRole(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setIsUpdate(false);
                router.refresh();
                return;
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            setIsUpdate(false);
            console.log(error)
        }
    }

    useEffect(() => {
        setSelectedPermissions(data?.menu_permission);
        setSelectedSubPermissions(data?.sub_menu_permission);
    }, []);

    return (
        <>
            <div className="create-wrapper">
                <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                    <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Update Role</h3>
                            <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                        </div>
                        <div className="create-form">
                            <form action={handleForm}>
                                <div className="create-form-group full-with-input">
                                    <label>Role Name</label>
                                    <input
                                        type="text"
                                        placeholder="Please enter a role name"
                                        name="role_name"
                                        defaultValue={data?.role_name}
                                        required
                                    />
                                    <input
                                        type="hidden"
                                        name="id"
                                        defaultValue={data?._id}
                                    />
                                </div>
                                <MenuOption
                                    openMenus={openMenus}
                                    toggleDropdown={toggleDropdown}
                                    isAllSelected={isAllSelected}
                                    handleCheckboxChange={handleCheckboxChange}
                                    selectedPermissions={selectedPermissions}
                                    handleCheckboxChangeAlt={handleCheckboxChangeAlt}
                                    selectedSubPermissions={selectedSubPermissions}
                                />
                                <div className="create-form-action">
                                    {isAllShow ? (
                                        <div className="allFunc" onClick={() => handleExpandAll("")}>
                                            Collapse All
                                        </div>
                                    ) : (
                                        <div className="allFunc" onClick={() => handleExpandAll("showAll")}>
                                            Expand All
                                        </div>
                                    )}
                                    <div className="allFunc" onClick={handleSelectAll}>
                                        {isAllSelected ? "Deselect All" : "Select All"}
                                    </div>
                                    <Submit setShowModal={setIsUpdate} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const MenuOption = ({ openMenus, toggleDropdown, selectedPermissions, handleCheckboxChange, selectedSubPermissions, handleCheckboxChangeAlt }) => {

    return (
        <div className="role-dropdown-wrapper">
            <p>Menu Permission</p>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("frontPage")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.frontPage}
                            onChange={() => handleCheckboxChange("frontPage")}
                        />
                        <span>Front Page</span>
                    </div>
                    {openMenus.frontPage && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.analytics}
                                        onChange={() => handleCheckboxChangeAlt("analytics")}
                                    />
                                    <span>Main Console</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("systemManagement")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.systemManagement}
                            onChange={() => handleCheckboxChange("systemManagement")}
                        />
                        <span>System Management</span>
                    </div>
                    {openMenus.systemManagement && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.systemSetting}
                                        onChange={() => handleCheckboxChangeAlt("systemSetting")}
                                    />
                                    <span>System Setting</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.systemUser}
                                        onChange={() => handleCheckboxChangeAlt("systemUser")}
                                    />
                                    <span>System Users</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.roleManagement}
                                        onChange={() => handleCheckboxChangeAlt("roleManagement")}
                                    />
                                    <span>Role Management</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.customerSupport}
                                        onChange={() => handleCheckboxChangeAlt("customerSupport")}
                                    />
                                    <span>Customer Service List</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("mallManagement")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.mallManagement}
                            onChange={() => handleCheckboxChange("mallManagement")}
                        />
                        <span>Mall Management</span>
                    </div>
                    {openMenus.mallManagement && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.announcement}
                                        onChange={() => handleCheckboxChangeAlt("announcement")}
                                    />
                                    <span>Announcement</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.content}
                                        onChange={() => handleCheckboxChangeAlt("content")}
                                    />
                                    <span>Content</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.product}
                                        onChange={() => handleCheckboxChangeAlt("product")}
                                    />
                                    <span>Products</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.notification}
                                        onChange={() => handleCheckboxChangeAlt("notification")}
                                    />
                                    <span>Notification</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("memberManagement")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.memberManagement}
                            onChange={() => handleCheckboxChange("memberManagement")}
                        />
                        <span>Member Management</span>
                    </div>
                    {openMenus.memberManagement && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.memberList}
                                        onChange={() => handleCheckboxChangeAlt("memberList")}
                                    />
                                    <span>Memberlist</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.memberLevel}
                                        onChange={() => handleCheckboxChangeAlt("memberLevel")}
                                    />
                                    <span>Membership Level</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.agentManagement}
                                        onChange={() => handleCheckboxChangeAlt("agentManagement")}
                                    />
                                    <span>Agent Management</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.loginHistory}
                                        onChange={() => handleCheckboxChangeAlt("loginHistory")}
                                    />
                                    <span>Login History</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.systemAccess}
                                        onChange={() => handleCheckboxChangeAlt("systemAccess")}
                                    />
                                    <span>System Access</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("tradeManagement")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.tradeManagement}
                            onChange={() => handleCheckboxChange("tradeManagement")}
                        />
                        <span>Trade Management</span>
                    </div>
                    {openMenus.tradeManagement && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.withdrawal}
                                        onChange={() => handleCheckboxChangeAlt("withdrawal")}
                                    />
                                    <span>Withdrawal</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.order}
                                        onChange={() => handleCheckboxChangeAlt("order")}
                                    />
                                    <span>Order</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.accountChange}
                                        onChange={() => handleCheckboxChangeAlt("accountChange")}
                                    />
                                    <span>Account Change</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.recharge}
                                        onChange={() => handleCheckboxChangeAlt("recharge")}
                                    />
                                    <span>Recharge</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.activities}
                                        onChange={() => handleCheckboxChangeAlt("activities")}
                                    />
                                    <span>Activities</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="divider">
                <p>Operational Permissions</p>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.setUpOrder}
                            onChange={() => handleCheckboxChange("setUpOrder")}
                        />
                        <span>Set up orders</span>
                    </div>
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.creditDebit}
                            onChange={() => handleCheckboxChange("creditDebit")}
                        />
                        <span>Credit/Debit</span>
                    </div>
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.resetOrderQuantity}
                            onChange={() => handleCheckboxChange("resetOrderQuantity")}
                        />
                        <span>Reset Order Quantity</span>
                    </div>
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <span className="fa fa-angle-right angle-menu-icon" onClick={() => toggleDropdown("moreActions")}></span>
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.moreActions}
                            onChange={() => handleCheckboxChange("moreActions")}
                        />
                        <span>More Actions</span>
                    </div>
                    {openMenus.moreActions && (
                        <div className="dropdown-childs">
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.walletInfo}
                                        onChange={() => handleCheckboxChangeAlt("walletInfo")}
                                    />
                                    <span>Wallet Info</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.edit}
                                        onChange={() => handleCheckboxChangeAlt("edit")}
                                    />
                                    <span>Edit</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.accountChangeMenu}
                                        onChange={() => handleCheckboxChangeAlt("accountChangeMenu")}
                                    />
                                    <span>Account Change</span>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        className="large-checkbox"
                                        checked={selectedSubPermissions.dealingHistory}
                                        onChange={() => handleCheckboxChangeAlt("dealingHistory")}
                                    />
                                    <span>Dealing History</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.accessAllClient}
                            onChange={() => handleCheckboxChange("accessAllClient")}
                        />
                        <span>Access to All Client</span>
                    </div>
                </div>
            </div>
            <div className="dropdown-menu-wrapper">
                <div className="dropdown-menu">
                    <div className="dropdown-menu-first-node">
                        <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={selectedPermissions.remarks}
                            onChange={() => handleCheckboxChange("remarks")}
                        />
                        <span>Remarks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default UpdateRole;