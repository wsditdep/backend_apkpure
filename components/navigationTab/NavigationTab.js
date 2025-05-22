"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const NavigationTab = ({ authenticatedUser }) => {
    const pathname = usePathname();
    const [tabs, setTabs] = useState([]);
    const router = useRouter();

    const isEnglish = authenticatedUser?.language === "en";

    const translations = {
        refresh: isEnglish ? "Refresh current" : "刷新当前",
        closeCurrent: isEnglish ? "Close current" : "关闭当前",
        closeOther: isEnglish ? "Close other" : "关闭其他",
        closeAll: isEnglish ? "Close all" : "全部关闭",
        refreshed: isEnglish ? "Refreshed Successfully" : "刷新成功",
    };

    useEffect(() => {
        const existingTabs = JSON.parse(localStorage.getItem("tabs")) || [];
        if (!existingTabs.find(tab => tab.path === pathname)) {
            const newTab = { id: Date.now(), path: pathname, name: getTabName(pathname) };
            const updatedTabs = [...existingTabs, newTab];
            localStorage.setItem("tabs", JSON.stringify(updatedTabs));
            setTabs(updatedTabs);
        } else {
            setTabs(existingTabs);
        }
    }, [pathname]);

    useEffect(() => {
        const existingTabs = JSON.parse(localStorage.getItem("tabs")) || [];
        const updatedTabs = existingTabs.map(tab => ({
            ...tab,
            name: getTabName(tab.path)
        }));
        setTabs(updatedTabs);
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
    }, [isEnglish]);

    const getTabName = (path) => {
        const tabNames = {
            "/dashboard/analytics": isEnglish ? "Analytics" : "分析",
            "/dashboard/system/systemSetting": isEnglish ? "Settings" : "设置",
            "/dashboard/system/systemUser": isEnglish ? "System User" : "系统用户",
            "/dashboard/system/role": isEnglish ? "Role Management" : "角色管理",
            "/dashboard/system/support": isEnglish ? "Support" : "支持",
            "/dashboard/mall/announcement": isEnglish ? "Announcement" : "公告",
            "/dashboard/mall/contentManagement": isEnglish ? "Content" : "内容",
            "/dashboard/mall/productManagement": isEnglish ? "Products" : "产品",
            "/dashboard/mall/popupManagement": isEnglish ? "Notification" : "通知",
            "/dashboard/membership/list": isEnglish ? "Member List" : "会员名单",
            "/dashboard/membership/grade": isEnglish ? "Member Level" : "会员级别",
            "/dashboard/membership/agent": isEnglish ? "Agent Management" : "代理管理",
            "/dashboard/membership/logHistory": isEnglish ? "Login History" : "登录记录",
            "/dashboard/trade/withdrawalList": isEnglish ? "Withdrawal" : "提款",
            "/dashboard/trade/orderList": isEnglish ? "Order List" : "订单清单",
            "/dashboard/trade/accountChange": isEnglish ? "Account Change" : "账户变更",
            "/dashboard/trade/rechargeList": isEnglish ? "Recharge List" : "充值清单",
            "/dashboard/trade/actions": isEnglish ? "Activities" : "活动",
        };

        if (/^\/dashboard\/journey\/[a-zA-Z0-9]+$/.test(path)) return isEnglish ? "Journey" : "旅程";
        if (/^\/dashboard\/dealingHistory+$/.test(path)) return isEnglish ? "Dealing History" : "交易历史";

        return tabNames[path] || path;
    };

    const removeTab = (id) => {
        const updatedTabs = tabs.filter(tab => tab.id !== id);
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
        setTabs(updatedTabs);
        router.refresh();
    };

    const navigateToLink = (link) => router.push(link);

    const refreshCurrent = () => {
        setTimeout(() => {
            toast.success(translations.refreshed);
            router.refresh();
        }, 1000);
    };

    const closeCurrentTab = () => {
        const updatedTabs = tabs.filter(tab => tab.path !== pathname);
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
        setTabs(updatedTabs);
        if (updatedTabs.length) router.push(updatedTabs[updatedTabs.length - 1].path);
    };

    const closeOtherTab = () => {
        const updatedTabs = tabs.filter(tab => tab.path === pathname);
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
        setTabs(updatedTabs);
    };

    const closeAllTab = () => {
        localStorage.removeItem("tabs");
        setTabs([]);
        router.push("/dashboard/analytics"); // Navigate to a default route
    };

    return (
        <>
            <div className="navigation-tab-wrapper">
                <div className="navigation-tab-parent">
                    <div className="navigation-tab-child page_animation">
                        <ul>
                            {tabs.map((tab) => (
                                <div className="tab-wrap" key={tab.id}>
                                    <li
                                        className={tab.path === pathname ? 'active-navigate-tab' : ''}
                                        onClick={() => navigateToLink(tab.path)}
                                    >
                                        {tab.name}
                                    </li>
                                    <i className="fa fa-times" onClick={() => removeTab(tab.id)}></i>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="navigation-tab-child">
                        <div className="tab-nav-slider-dropdown">
                            <i className="fa fa-angle-down"></i>
                            <div className="tab-nav-slider-dropdown-inner">
                                <button onClick={refreshCurrent}><i className="fa fa-refresh"></i> <p>{translations.refresh}</p></button>
                                <button onClick={closeCurrentTab}><i className="fa fa-times"></i> <p>{translations.closeCurrent}</p></button>
                                <button onClick={closeOtherTab}><i className="fa fa-list"></i> <p>{translations.closeOther}</p></button>
                                <button onClick={closeAllTab}><i className="fa fa-minus"></i> <p>{translations.closeAll}</p></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavigationTab;

