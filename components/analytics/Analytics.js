import Link from "next/link";
import { getAnalytics } from "@/app/actions/analytics/data"
import { fetchMenuUserPermission } from "@/app/actions/role/data";
import { auth } from "@/app/auth";
import { fetchAuthenticatedUser } from "@/app/actions/user/data";
import { fetchLoginHistory, fetchMembership, fetchRoleDetails } from "@/app/actions/membership/data";
import { fetchRechargeOnly } from "@/app/actions/recharge/data";
import moment from 'moment';
import 'moment-timezone';

import dynamic from "next/dynamic";
import Loader from "@/components/progress/Loader";
import Unauthorized from "../notFound/Unauthorized";

const Webtrafic = dynamic(() => import("@/components/analytics/Webtrafic"), {
    loading: () => <Loader />
});

const AccountLevel = dynamic(() => import("@/components/analytics/AccountLevel"), {
    loading: () => <Loader />
});

const Analytics = async () => {

    const { data } = await getAnalytics();
    const { subPermission } = await fetchMenuUserPermission() || {};

    const { user } = await auth();
    const authenticatedUser = await fetchAuthenticatedUser(user?._id) || {};

    const { logs } = await fetchLoginHistory() || [];
    const membership = await fetchMembership() || [];
    const roles = await fetchRoleDetails() || [];
    const topup = await fetchRechargeOnly() || [];

    return (
        <>
            {
                subPermission?.analytics
                    ?
                    <section className="analytic-section">
                        <>
                            <div className="report-card-wrapper">
                                <div className="report-card-parent">
                                    <div className="report-card-childs">
                                        <div className="report-card-inner-parent">
                                            <div className="report-card-inner-childs report-primary">
                                                <i className="fa fa-toggle-on"></i>
                                            </div>
                                            <div className="report-card-inner-childs">
                                                <p>{authenticatedUser?.language === "en" ? "ACTIVE USER" : "活跃用户"}</p>
                                            </div>
                                        </div>
                                        <div className="report-counter">
                                            <i className="fa fa-arrow-up increase"></i><h3>{data?.activeUsers ?? "Loading"}</h3>
                                        </div>
                                    </div>
                                    <div className="report-card-childs">
                                        <div className="report-card-inner-parent">
                                            <div className="report-card-inner-childs report-bright">
                                                <i className="fa fa-chart-line"></i>
                                            </div>
                                            <div className="report-card-inner-childs">
                                                <p>{authenticatedUser?.language === "en" ? "ADMINISTRATOR" : "行政人员"}</p>
                                            </div>
                                        </div>
                                        <div className="report-counter">
                                            <i className="fa fa-arrow-up increase"></i><h3>{data?.admin ?? "Loading"}</h3>
                                        </div>
                                    </div>
                                    <div className="report-card-childs">
                                        <div className="report-card-inner-parent">
                                            <div className="report-card-inner-childs report-green">
                                                <i className="fa fa-users"></i>
                                            </div>
                                            <div className="report-card-inner-childs">
                                                <p>{authenticatedUser?.language === "en" ? "CUSTOMER" : "顾客"}</p>
                                            </div>
                                        </div>
                                        <div className="report-counter">
                                            <i className="fa fa-arrow-up increase"></i><h3>{data?.userAccount ?? "Loading"}</h3>
                                        </div>
                                    </div>
                                    <div className="report-card-childs">
                                        <div className="report-card-inner-parent">
                                            <div className="report-card-inner-childs report-purple">
                                                <i className="fa fa-phone"></i>
                                            </div>
                                            <div className="report-card-inner-childs">
                                                <p>{authenticatedUser?.language === "en" ? "PRACTICE ACCOUNT" : "练习账户"}</p>
                                            </div>
                                        </div>
                                        <div className="report-counter">
                                            <i className="fa fa-arrow-up increase"></i><h3>{data?.practiceAccount ?? "Loading"}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="report-card-container">
                                <div className="report-card-parent-container" style={{ background: "linear-gradient(52deg, rgb(43, 88, 118) 0%, rgb(78, 67, 118) 100%)" }}>
                                    <div className="report-card-childs-container">
                                        <div className="report-card-childs-container-sub">
                                            <p>{authenticatedUser?.language === "en" ? "Availabe Products" : "可用产品"}</p>
                                            <h3>{data?.availableProducts ?? "Loading"}</h3>
                                        </div>
                                        <div className="report-card-childs-container-sub">
                                            <i className="fa fa-box"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="report-card-parent-container" style={{ background: "linear-gradient(-55deg, rgb(246, 211, 101) 0%, rgb(253, 160, 133) 100%)" }}>
                                    <div className="report-card-childs-container">
                                        <div className="report-card-childs-container-sub">
                                            <p>{authenticatedUser?.language === "en" ? "Order Received" : "已收到订单"}</p>
                                            <h3>{data?.orderReceived ?? "Loading"}</h3>
                                        </div>
                                        <div className="report-card-childs-container-sub">
                                            <i className="fa fa-exchange"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="report-card-parent-container" style={{ background: "linear-gradient(52deg, rgb(71 119 0) 0%, rgb(140 233 0) 100%)" }}>
                                    <div className="report-card-childs-container">
                                        <div className="report-card-childs-container-sub">
                                            <p>{authenticatedUser?.language === "en" ? "Membership Level" : "会员级别"}</p>
                                            <h3>{data?.membershipLevel ?? "Loading"}</h3>
                                        </div>
                                        <div className="report-card-childs-container-sub">
                                            <i className="fa fa-user"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="report-card-parent-container" style={{ background: "linear-gradient(52deg, rgb(64 45 185) 0%, rgb(140 124 240) 100%)" }}>
                                    <div className="report-card-childs-container">
                                        <div className="report-card-childs-container-sub">
                                            <p>{authenticatedUser?.language === "en" ? "No. Of Transactions" : "交易数量"}</p>
                                            <h3>{data?.noOfTransaction ?? "Loading"}</h3>
                                        </div>
                                        <div className="report-card-childs-container-sub">
                                            <i className="fa fa-dollar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="analytics-wrapper">
                                <div className="analytics-wrapper-parents">
                                    <div className="analytics-wrapper-childs">
                                        <div className="d-card">
                                            <div className="d-card-header">
                                                <div className="d-card-header-childs">
                                                    <p>{authenticatedUser?.language === "en" ? "ANALYTICS" : "分析"}</p>
                                                    <h3>{authenticatedUser?.language === "en" ? "Membership" : "账户级别"}</h3>
                                                </div>
                                                <div className="d-card-header-childs">
                                                    <Link href="/dashboard/membership/grade">
                                                        {authenticatedUser?.language === "en" ? "View All" : "查看全部"}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="d-card-body d-card-body-bg-color card-body-padding">
                                                <AccountLevel
                                                    membership={JSON.parse(JSON.stringify(membership))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="analytics-wrapper-childs">
                                        <div className="d-card">
                                            <div className="d-card-header">
                                                <div className="d-card-header-childs">
                                                    <p>{authenticatedUser?.language === "en" ? "ROLES" : "客户"}</p>
                                                    <h3>{authenticatedUser?.language === "en" ? "User Roles" : "最近登录"}</h3>
                                                </div>
                                                <div className="d-card-header-childs">
                                                    <Link href="/dashboard/membership/list">
                                                        {authenticatedUser?.language === "en" ? "View All" : "查看全部"}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="d-card-body d-card-body-bg-color card-body-padding">
                                                <Webtrafic
                                                    roles={JSON.parse(JSON.stringify(roles))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="analytics-wrapper mt2">
                                <div className="analytics-wrapper-parents">
                                    <div className="analytics-wrapper-childs">
                                        <div className="d-card">
                                            <div className="d-card-header">
                                                <div className="d-card-header-childs">
                                                    <p>{authenticatedUser?.language === "en" ? "CLIENTS" : "客户"}</p>
                                                    <h3>{authenticatedUser?.language === "en" ? "Recent Login" : "最近登录"}</h3>
                                                </div>
                                                <div className="d-card-header-childs">
                                                    <Link href="/dashboard/membership/logHistory">
                                                        {authenticatedUser?.language === "en" ? "View All" : "查看全部"}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="d-card-body d-card-body-bg-color card-body-padding">
                                                <div className="card-table">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>{authenticatedUser?.language === "en" ? "Username" : "用户名"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "IP Address" : "IP地址"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "Country" : "国家"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "Time" : "时间"}</th>
                                                            </tr>
                                                            {
                                                                logs?.map((data, index) => {
                                                                    const createdTime = moment.tz(data?.createdAt, process.env.TIMWZONE);
                                                                    return (
                                                                        <tr key={index} className="notranslate">
                                                                            <td>{data?.username}</td>
                                                                            <td className="form-type">
                                                                                <p className="form-type-green">{data?.ip_address}</p>
                                                                            </td>
                                                                            <td>{data?.country_name}</td>
                                                                            <td>{createdTime.fromNow()}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="analytics-wrapper-childs">
                                        <div className="d-card">
                                            <div className="d-card-header">
                                                <div className="d-card-header-childs">
                                                    <p>{authenticatedUser?.language === "en" ? "TRANSACTIONS" : "交易"}</p>
                                                    <h3>{authenticatedUser?.language === "en" ? "Recent transaction" : "最近交易"}</h3>
                                                </div>
                                                <div className="d-card-header-childs">
                                                    <Link href="/dashboard/trade/rechargeList">
                                                        {authenticatedUser?.language === "en" ? "View All" : "查看全部"}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="d-card-body d-card-body-bg-color card-body-padding">
                                                <div className="card-table">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>{authenticatedUser?.language === "en" ? "Username" : "用户名"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "Amount" : "数量"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "Type" : "类型"}</th>
                                                                <th>{authenticatedUser?.language === "en" ? "Time" : "时间"}</th>
                                                            </tr>
                                                            {
                                                                topup?.map((data, index) => {
                                                                    const createdTime = moment.tz(data?.createdAt, process.env.TIMWZONE);
                                                                    return (
                                                                        <tr key={index} className="notranslate">
                                                                            <td>{data?.username}</td>
                                                                            <td>{data?.amount}</td>
                                                                            <td className="form-type">
                                                                                <p className={data?.recharge_type === "credit" ? "form-type-green" : "form-type-red"}>{data?.recharge_type}</p>
                                                                            </td>
                                                                            <td>{createdTime.fromNow()}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="analytics-wrapper mt2">
                                <div className="analytics-wrapper-parents">
                                    <div className="analytics-wrapper-childs">
                                        <div className="d-card">
                                            <div className="d-card-header">
                                                <div className="d-card-header-childs">
                                                    <p>{authenticatedUser?.language === "en" ? "COMMISSIONS" : "客户"}</p>
                                                    <h3>{authenticatedUser?.language === "en" ? "Commission Rates" : "最近登录"}</h3>
                                                </div>
                                                <div className="d-card-header-childs">
                                                    <Link href="/dashboard/membership/grade">
                                                        View All
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="d-card-body d-card-body-bg-color card-body-padding">
                                                <div className="card-table">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Membership Name</th>
                                                                <th>Normal Commission (%)</th>
                                                                <th>Ticket Commission (%)</th>
                                                                <th>Account Balance Limit</th>
                                                                <th>Number Of Withdrawal</th>
                                                            </tr>
                                                            {
                                                                membership?.map((data, index) => (
                                                                    <tr key={index} className="notranslate">
                                                                        <td>{data?.membership_name}</td>
                                                                        <td className="form-type">
                                                                            <p className="form-type-green">{(data?.commission_rate * 100)?.toFixed(2)}%</p>
                                                                        </td>
                                                                        <td className="form-type">
                                                                            <p className="form-type-blue">{(data?.ticket_commission * 100)?.toFixed(2)}%</p>
                                                                        </td>
                                                                        <td>{data?.account_balance_limit}</td>
                                                                        <td>{data?.number_of_withdrawal}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </section>
                    :
                    <>
                        <Unauthorized
                            authenticatedUser={JSON.parse(JSON.stringify(authenticatedUser))}
                        />
                    </>
            }
        </>
    )
}

export default Analytics