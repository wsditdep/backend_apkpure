"use client";

import Link from "next/link";
import Logout from "../auth/Logout";
import { usePathname, useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import SecurityCheck from "../securityCheck/SecurityCheck";
import { changeLang } from "@/app/actions/user/action";

const SecondaryBar = ({ user, authenticatedUser, withdrawalCount, permission, subPermission, settingVal }) => {

    const pathname = usePathname();
    const parts = pathname.split('/');
    const matchVal = parts[2];

    const router = useRouter();

    const copyToClipboard = (val) => {
        navigator.clipboard.writeText(val);
        return toast.success(`Copied - (${val})`);
    }

    const changeLanguage = async (val, id) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("val", val);

        console.log(formData)
        const res = await changeLang(formData);
        console.log(res)
        if (res.status === 201) {
            setTimeout(() => {

                if (val === "en") {
                    toast.success("Language switch to English");
                } else {
                    toast.success("语言切换为英语");
                }

            }, [1000]);

            router.refresh();
        }
    }
    return (
        <>
            <div className="navigation-wrapper">
                <div className="navigation-parent">
                    <div className="navigation-childs">
                        <ul>
                            {
                                permission?.frontPage
                                    ?
                                    <li className={`${matchVal === "analytics" ? "active-side-tab " : ""}`}>
                                        <Link href="/dashboard/analytics">
                                            <i className="fa fa-line-chart"></i> {authenticatedUser?.language === "en" ? "Analytics" : "分析"}
                                        </Link>
                                    </li>
                                    :
                                    <></>
                            }
                            {
                                permission?.systemManagement
                                    ?
                                    <li className={`${matchVal === "system" ? "active-side-tab " : ""}`}>
                                        <Link href="/dashboard/system/systemSetting">
                                            <i className="fa fa-desktop"></i> {authenticatedUser?.language === "en" ? "System Management" : "系统管理"}
                                        </Link>
                                    </li>
                                    :
                                    <></>
                            }
                            {
                                permission?.mallManagement
                                    ?
                                    <li className={`${matchVal === "mall" ? "active-side-tab " : ""}`}>
                                        <Link href="/dashboard/mall/announcement">
                                            <i className="fa fa-bank"></i> {authenticatedUser?.language === "en" ? "Mall Management" : "商场管理"}
                                        </Link>
                                    </li>
                                    :
                                    <></>

                            }
                            {
                                permission?.memberManagement
                                    ?
                                    <li className={`${matchVal === "membership" ? "active-side-tab " : ""}`}>
                                        <Link href="/dashboard/membership/list">
                                            <i className="fa fa-users"></i> {authenticatedUser?.language === "en" ? "Member Management" : "会员管理"}
                                        </Link>
                                    </li>
                                    :
                                    <></>
                            }
                            {
                                permission?.tradeManagement
                                    ?
                                    <li className={`${matchVal === "trade" ? "active-side-tab " : ""}`}>
                                        <Link href="/dashboard/trade/withdrawalList">
                                            <i className="fa fa-bar-chart"></i> {authenticatedUser?.language === "en" ? "Trade Management" : "贸易管理"}
                                        </Link>
                                    </li>
                                    :
                                    <></>
                            }
                        </ul>
                    </div>
                    <div className="navigation-childs">
                        <div className="loggedin_info">
                            <Link href="/dashboard/trade/withdrawalList">
                                <div className="withdrawal-icon">
                                    <div className="withdrawal-count">
                                        <h6>{withdrawalCount}</h6>
                                    </div>
                                    <p>{authenticatedUser?.language === "en" ? "Withdrawal" : "提款"} </p>
                                </div>
                            </Link>
                        </div>
                        <div className="loggedin_info">
                            <div className="second_nav_dropdown_wrapper">
                                <p><i className="fa fa-earth"></i> {authenticatedUser?.language === "en" ? "EN" : "CH"}</p>
                                <div className="second_nav_dropdown_wrapper_down">
                                    <button onClick={() => changeLanguage("ch", authenticatedUser?._id)} className={authenticatedUser?.language === "ch" ? "activeLanguage" : ""}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 32 32"
                                        >
                                            <rect
                                                width="30"
                                                height="24"
                                                x="1"
                                                y="4"
                                                fill="#db362f"
                                                rx="4"
                                                ry="4"
                                            ></rect>
                                            <path
                                                d="M27 4H5a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4m3 20c0 1.654-1.346 3-3 3H5c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h22c1.654 0 3 1.346 3 3z"
                                                opacity="0.15"
                                            ></path>
                                            <path
                                                fill="#ff0"
                                                d="M7.958 10.152 7.19 7.786l-.769 2.366H3.934l2.012 1.462-.769 2.365 2.013-1.462 2.012 1.462-.769-2.365 2.013-1.462zM12.725 8.187l.427.711.072-.826.808-.186-.763-.324.073-.826-.544.625-.763-.324.426.711-.544.625zM14.865 10.372l.117.821.388-.733.817.142-.577-.595.387-.733-.744.365-.578-.595.118.821-.745.365zM15.597 13.612l.653-.511-.829.029-.284-.778-.228.797-.828.03.688.463-.228.797.653-.511.687.463zM13.26 15.535l.038-.828-.518.647-.775-.292.455.692-.518.648.8-.22.456.693.038-.828.8-.22z"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M27 5H5a3 3 0 0 0-3 3v1a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3V8a3 3 0 0 0-3-3"
                                                opacity="0.2"
                                            ></path>
                                        </svg>
                                        <p>Chinese - CH</p>
                                    </button>
                                    <button onClick={() => changeLanguage("en", authenticatedUser?._id)} className={authenticatedUser?.language === "en" ? "activeLanguage" : ""}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 32 32"
                                        >
                                            <rect width="30" height="24" x="1" y="4" fill="#fff" rx="4" ry="4"></rect>
                                            <path
                                                fill="#a62842"
                                                d="M1.638 5.846h28.724A3.99 3.99 0 0 0 27 4H5a3.99 3.99 0 0 0-3.362 1.846M2.03 7.692C2.022 7.795 2 7.894 2 8v1.539h29V8c0-.105-.022-.204-.03-.308zM2 11.385h29v1.846H2zM2 15.077h29v1.846H2zM1 18.769h30v1.846H1zM1 24c0 .105.023.204.031.308h29.938c.008-.103.031-.202.031-.308v-1.539H1zM30.362 26.154H1.638A3.99 3.99 0 0 0 5 28h22a3.99 3.99 0 0 0 3.362-1.846"
                                            ></path>
                                            <path fill="#102d5e" d="M5 4h11v12.923H1V8c0-2.208 1.792-4 4-4"></path>
                                            <path
                                                d="M27 4H5a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4m3 20c0 1.654-1.346 3-3 3H5c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h22c1.654 0 3 1.346 3 3z"
                                                opacity="0.15"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M27 5H5a3 3 0 0 0-3 3v1a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3V8a3 3 0 0 0-3-3"
                                                opacity="0.2"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="m4.601 7.463.592-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.226.695.592-.429.591.429zM7.58 7.463l.592-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.226.695.592-.429.591.429zM10.56 7.463l.591-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.225.695.591-.429.591.429zM6.066 9.283l.592-.429h-.731l-.226-.696-.226.696h-.731l.591.429-.226.696.592-.43.591.43zM9.046 9.283l.591-.429h-.731l-.226-.696-.226.696h-.731l.591.429-.225.696.591-.43.591.43zM12.025 9.283l.591-.429h-.731l-.226-.696-.226.696h-.731l.592.429-.226.696.591-.43.592.43zM6.066 12.924l.592-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.226.695.592-.429.591.429zM9.046 12.924l.591-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.225.695.591-.429.591.429zM12.025 12.924l.591-.43h-.731l-.226-.695-.226.695h-.731l.592.43-.226.695.591-.429.592.429zM13.539 7.463l.591-.43h-.731l-.226-.695-.226.695h-.731l.592.43-.226.695.591-.429.592.429zM4.601 11.104l.592-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.226.695.592-.43.591.43zM7.58 11.104l.592-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.226.695.592-.43.591.43zM10.56 11.104l.591-.43h-.731l-.226-.695-.226.695h-.731l.591.43-.225.695.591-.43.591.43zM13.539 11.104l.591-.43h-.731l-.226-.695-.226.695h-.731l.592.43-.226.695.591-.43.592.43zM4.601 14.744l.592-.429h-.731l-.226-.696-.226.696h-.731l.591.429-.226.696.592-.43.591.43zM7.58 14.744l.592-.429h-.731l-.226-.696-.226.696h-.731l.591.429-.226.696.592-.43.591.43zM10.56 14.744l.591-.429h-.731l-.226-.696-.226.696h-.731l.591.429-.225.696.591-.43.591.43zM13.539 14.744l.591-.429h-.731l-.226-.696-.226.696h-.731l.592.429-.226.696.591-.43.592.43z"
                                            ></path>
                                        </svg>
                                        <p>English - EN</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="loggedin_info">
                            <div className="user-letter">
                                <p className="notranslate">{user?.username[0]?.toUpperCase() ?? ""}</p>
                            </div>
                            <h1 className="notranslate">{user?.username}</h1>
                            <div className="logout-btn-wrapper">
                                <div className="logout-btn-inner-wrapper">
                                    <h3>{authenticatedUser?.language === "en" ? "Hi" : "你好"}, <span className="notranslate">{user?.username}</span></h3>
                                    <p className="notranslate">{user?.role}</p>
                                    <h4 onClick={() => copyToClipboard(user?.invitation_code ?? "")}>{authenticatedUser?.language === "en" ? "Invitation Code" : "邀请码"}: {user?.invitation_code ?? ""} <i className="fa fa-file-alt"></i></h4>
                                </div>
                                <ul>
                                    <Link href={`/dashboard/user/${user?._id}`}>
                                        <li>{authenticatedUser?.language === "en" ? "Change Password" : "更改密码"}</li>
                                    </Link>
                                </ul>
                                <Logout authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SecurityCheck
                user={user}
                authenticatedUser={authenticatedUser}
                permission={permission}
                subPermission={subPermission}
                settingVal={settingVal}
                withdrawalCount={withdrawalCount}
            />
        </>
    )
}

export default SecondaryBar;