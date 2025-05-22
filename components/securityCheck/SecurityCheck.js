"use client";

import { logout } from "@/app/actions/user/action";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SecurityCheck = ({ user, authenticatedUser, subPermission, permission, settingVal, withdrawalCount }) => {
    const router = useRouter();
    const pathname = usePathname();
    const audioRef = useRef(null);

    const checkSecurity = async () => {
        const isBlocked = authenticatedUser?.status;

        if (!isBlocked) {
            await logout();
            router.push("/");
        } else if (user?.security_code !== authenticatedUser?.security_code) {
            await logout();
            router.push("/");
        }
    };

    const unauthorizedLogout = async () => {
        await logout();
        router.back();
        return;
    }

    const protectURL = async () => {
        if (pathname === "/dashboard/analytics" && !permission?.frontPage) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/system/systemSetting" && !permission?.systemManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/mall/announcement" && !permission?.mallManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/membership/list" && !permission?.memberManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/trade/withdrawalList" && !permission?.tradeManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/dealingHistory" && !permission?.accessDealingRecord) {
            // unauthorizedLogout();
        }

        // validating sub main links
        if (pathname === "/dashboard/analytics" && !permission?.frontPage) {

        } else if (pathname === "/dashboard/system/systemSetting" && !subPermission?.systemSetting) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/system/systemUser" && !subPermission?.systemUser) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/system/role" && !subPermission?.roleManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/mall/announcement" && !subPermission?.announcement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/mall/contentManagement" && !subPermission?.content) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/mall/productManagement" && !subPermission?.product) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/membership/list" && !subPermission?.memberList) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/membership/grade" && !subPermission?.memberLevel) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/membership/agent" && !subPermission?.agentManagement) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/membership/logHistory" && !subPermission?.loginHistory) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/trade/withdrawalList" && !subPermission?.withdrawal) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/trade/orderList" && !subPermission?.order) {
            // unauthorizedLogout();
        } else if (pathname === "dashboard/trade/accountChange" && !subPermission?.accountChange) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/trade/rechargeList" && !subPermission?.recharge) {
            // unauthorizedLogout();
        } else if (pathname === "/dashboard/trade/actions" && !subPermission?.activities) {
            // unauthorizedLogout();
        }
    }

    useEffect(() => {
        checkSecurity();
        protectURL();

        if (settingVal?.is_alert) {
            if (withdrawalCount !== 0) {
                if (audioRef.current) {
                    audioRef.current.muted = true; // Muting audio to ensure autoplay works
                    audioRef.current.play().then(() => {
                        audioRef.current.muted = false; // Unmute after starting playback
                    }).catch((error) => {
                        console.error("Autoplay failed:", error); // Log any errors
                    });
                }
            }
        }

    }, []);

    return <>
        <audio ref={audioRef} src="/sound1.mp3" loop />
    </>;
};

export default SecurityCheck;
