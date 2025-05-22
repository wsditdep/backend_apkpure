"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SideBar = ({ subPermission, authenticatedUser }) => {
    const pathname = usePathname();
    const router = useRouter();

    const showSystemMenu = pathname.includes('/dashboard/system');
    const showMembershipMenu = pathname.includes('/dashboard/membership') || pathname.includes('/dashboard/dealingHistory');
    const showMembershipAltMenu = pathname.includes('/dashboard/journey');
    const showTradeMenu = pathname.includes('/dashboard/trade');
    const showMallMenu = pathname.includes('/dashboard/mall');
    const showReportMenu = pathname.includes('/dashboard/analytics');

    useEffect(() => {
        if (pathname === '/dashboard') {
            router.replace('/dashboard/analytics');
        }
    }, []);

    return (
        <div className="side-bar-wrapper">
            <h2>{authenticatedUser?.language === "en" ? "Control Center" : "控制中心"}</h2>
            <p>v4.0.0</p>
            {showReportMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "Platform Analytics" : "平台分析"} <i className="fa fa-angle-down"></i></h3>
                    <Link href="/dashboard/analytics">
                        <li className={`${pathname === "/dashboard/analytics" ? "nav-active" : ""}`}>
                            <i className="fa fa-line-chart"></i> {authenticatedUser?.language === "en" ? "Analytics" : "分析"}
                        </li>
                    </Link>
                </ul>
            )}
            {showMembershipMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "Member Management" : "会员管理"} <i className="fa fa-angle-down"></i></h3>
                    {
                        subPermission?.memberList
                            ?
                            <Link href="/dashboard/membership/list">
                                <li className={`${pathname === "/dashboard/membership/list" ? "nav-active" : ""}`}>
                                    <i className="fa fa-user"></i> {authenticatedUser?.language === "en" ? "Member List" : "会员名单"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.memberLevel
                            ?
                            <Link href="/dashboard/membership/grade">
                                <li className={`${pathname === "/dashboard/membership/grade" ? "nav-active" : ""}`}>
                                    <i className="fa fa-bar-chart"></i> {authenticatedUser?.language === "en" ? "Member Level" : "会员级别"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.agentManagement
                            ?
                            <Link href="/dashboard/membership/agent">
                                <li className={`${pathname === "/dashboard/membership/agent" ? "nav-active" : ""}`}>
                                    <i className="fa-solid fa-code-branch"></i> {authenticatedUser?.language === "en" ? "Agent Management" : "代理管理"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.loginHistory
                            ?
                            <Link href="/dashboard/membership/logHistory">
                                <li className={`${pathname === "/dashboard/membership/logHistory" ? "nav-active" : ""}`}>
                                    <i className="fa fa-bars"></i> {authenticatedUser?.language === "en" ? "Login History" : "登录记录"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.systemAccess
                            ?
                            <Link href="/dashboard/membership/adminLogHistory">
                                <li className={`${pathname === "/dashboard/membership/adminLogHistory" ? "nav-active" : ""}`}>
                                    <i className="fa fa-exchange"></i> {authenticatedUser?.language === "en" ? "System Access" : "系统访问"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                </ul>
            )}
            {showMembershipAltMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "Member Management" : "会员管理"} <i className="fa fa-angle-down"></i></h3>
                    {
                        subPermission?.memberList
                            ?
                            <Link href="/dashboard/membership/list">
                                <li className={`${pathname === "/dashboard/membership/list" ? "nav-active" : ""}`}>
                                    <i className="fa fa-user"></i> {authenticatedUser?.language === "en" ? "Member List" : "会员名单"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.memberLevel
                            ?
                            <Link href="/dashboard/membership/grade">
                                <li className={`${pathname === "/dashboard/membership/grade" ? "nav-active" : ""}`}>
                                    <i className="fa fa-bar-chart"></i> {authenticatedUser?.language === "en" ? "Member Level" : "会员级别"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.agentManagement
                            ?
                            <Link href="/dashboard/membership/agent">
                                <li className={`${pathname === "/dashboard/membership/agent" ? "nav-active" : ""}`}>
                                    <i className="fa-solid fa-code-branch"></i> {authenticatedUser?.language === "en" ? "Agent Management" : "代理管理"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                </ul>
            )}
            {showTradeMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "Trade Management" : "贸易管理"} <i className="fa fa-angle-down"></i></h3>
                    {
                        subPermission?.withdrawal
                            ?
                            <Link href="/dashboard/trade/withdrawalList">
                                <li className={`${pathname === "/dashboard/trade/withdrawalList" ? "nav-active" : ""}`}>
                                    <i className="fa fa-exchange"></i> {authenticatedUser?.language === "en" ? "Withdrawal" : "提款"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.order
                            ?
                            <Link href="/dashboard/trade/orderList">
                                <li className={`${pathname === "/dashboard/trade/orderList" ? "nav-active" : ""}`}>
                                    <i className="fa fa-box"></i> {authenticatedUser?.language === "en" ? "Order List" : "订单清单"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.accountChange
                            ?
                            <Link href="/dashboard/trade/accountChange">
                                <li className={`${pathname === "/dashboard/trade/accountChange" ? "nav-active" : ""}`}>
                                    <i className="fa fa-mobile-alt"></i> {authenticatedUser?.language === "en" ? "Account Change" : "账户变更"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.recharge
                            ?
                            <Link href="/dashboard/trade/rechargeList">
                                <li className={`${pathname === "/dashboard/trade/rechargeList" ? "nav-active" : ""}`}>
                                    <i className="fa fa-dollar"></i> {authenticatedUser?.language === "en" ? "Recharge List" : "充值清单"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.activities
                            ?
                            <Link href="/dashboard/trade/actions">
                                <li className={`${pathname === "/dashboard/trade/actions" ? "nav-active" : ""}`}>
                                    <i className="fa fa-list"></i> {authenticatedUser?.language === "en" ? "Activities" : "活动"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                </ul>
            )}
            {showMallMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "Mall Management" : "商场管理"} <i className="fa fa-angle-down"></i></h3>
                    {
                        subPermission?.announcement
                            ?
                            <Link href="/dashboard/mall/announcement">
                                <li className={`${pathname === "/dashboard/mall/announcement" ? "nav-active" : ""}`}>
                                    <i className="fa fa-bullhorn"></i> {authenticatedUser?.language === "en" ? "Announcement" : "公告"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.content
                            ?
                            <Link href="/dashboard/mall/contentManagement">
                                <li className={`${pathname === "/dashboard/mall/contentManagement" ? "nav-active" : ""}`}>
                                    <i className="fa fa-book"></i> {authenticatedUser?.language === "en" ? "Content" : "内容"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.product
                            ?
                            <Link href="/dashboard/mall/productManagement">
                                <li className={`${pathname === "/dashboard/mall/productManagement" ? "nav-active" : ""}`}>
                                    <i className="fa fa-box"></i> {authenticatedUser?.language === "en" ? "Products" : "产品"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.notification
                            ?
                            <Link href="/dashboard/mall/popupManagement">
                                <li className={`${pathname === "/dashboard/mall/popupManagement" ? "nav-active" : ""}`}>
                                    <i className="fa fa-bell"></i> {authenticatedUser?.language === "en" ? "Notification" : "通知"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                </ul>
            )}
            {showSystemMenu && (
                <ul>
                    <h3>{authenticatedUser?.language === "en" ? "System Management" : "系统管理"} <i className="fa fa-angle-down"></i></h3>
                    {
                        subPermission?.systemSetting
                            ?
                            <Link href="/dashboard/system/systemSetting">
                                <li className={`${pathname === "/dashboard/system/systemSetting" ? "nav-active" : ""}`}>
                                    <i className="fa fa-cog"></i> {authenticatedUser?.language === "en" ? "System Setting" : "系统设置"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.systemUser
                            ?
                            <Link href="/dashboard/system/systemUser">
                                <li className={`${pathname === "/dashboard/system/systemUser" ? "nav-active" : ""}`}>
                                    <i className="fa fa-user"></i> {authenticatedUser?.language === "en" ? "System User" : "系统用户"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.roleManagement
                            ?
                            <Link href="/dashboard/system/role">
                                <li className={`${pathname === "/dashboard/system/role" ? "nav-active" : ""}`}>
                                    <i className="fa fa-list"></i> {authenticatedUser?.language === "en" ? "Role Management" : "角色管理"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                    {
                        subPermission?.customerSupport
                            ?
                            <Link href="/dashboard/system/support">
                                <li className={`${pathname === "/dashboard/system/support" ? "nav-active" : ""}`}>
                                    <i className="fab fa-whatsapp "></i> {authenticatedUser?.language === "en" ? "Customer Support" : "客户支持"}
                                </li>
                            </Link>
                            :
                            <>
                            </>
                    }
                </ul>
            )}
        </div>
    );
}

export default SideBar;
