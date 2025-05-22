"use client";

import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { UpdateAllowOperation, updateSetting } from "@/app/actions/setting/action";
import { useRouter } from "next/navigation";

function Submit() {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    ""
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Submit`
            }
            </button>
        </>
    )
}

const SystemSetting = ({ settingVal, authenticatedUser }) => {

    const router = useRouter();

    const [minValue, set_minValue] = useState(settingVal?.matching_range_min ?? 0);
    const [maxValue, set_maxValue] = useState(settingVal?.matching_range_max ?? 0);

    const handleInput = (e) => {
        set_minValue(e.minValue);
        set_maxValue(e.maxValue);
    };

    const handleForm = async (formData) => {

        formData.append("matching_range_min", minValue);
        formData.append("matching_range_max", maxValue);

        try {
            const response = await updateSetting(formData);

            if (response.status === 201) {
                toast.success(response.message);
                return;
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const updateTheAppProcess = async (type) => {

        const formData = new FormData();
        formData.append("id", settingVal?._id);
        formData.append("type", type);

        try {
            const response = await UpdateAllowOperation(formData);

            if (response.status === 201) {
                toast.success(response.message);
                router.refresh();
                return;
            } else {
                toast.error(response.message);
                router.refresh();
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="create-wrapper system-setting-container page_animation">
                <div className="create-form">
                    <div className="system-setting-heading">
                        <h2>{authenticatedUser?.language === "en" ? "System Setting" : "系统设置"}</h2>
                    </div>
                    <form action={handleForm} >
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Site Title" : "网站标题"}</label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Please enter site title" : "请输入网站标题"}
                                name="title"
                                defaultValue={settingVal?.title ?? ""}
                            />
                            <input
                                type="hidden"
                                placeholder={authenticatedUser?.language === "en" ? "Please enter site title" : "请输入网站标题"}
                                name="id"
                                value={settingVal?._id}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Upper Level Member Trading Commission" : "上级会员交易佣金"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Upper Level Member Trading Commission (%)" : "上级会员交易佣金（%)"}
                                name="first_member"
                                required
                                defaultValue={settingVal?.first_member ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Upper Level 2 Member Trading Commission" : "上2级会员交易佣金"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Upper Level 2 Member Trading Commission  (%)" : "二级以上会员交易佣金（%）"}
                                name="second_member"
                                required
                                defaultValue={settingVal?.second_member ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Upper Level 3 Member Trading Commission" : "上层3级会员交易佣金"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Upper Level 3 Member Trading Commission (%)" : "上三级会员交易佣金（%）"}
                                name="third_member"
                                required
                                defaultValue={settingVal?.third_member ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Upper Level 4 Member Trading Commission" : "上4级会员交易佣金"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Upper Level 4 Member Trading Commission (%)" : "上4级会员交易佣金（%）"}
                                name="fourth_member"
                                required
                                defaultValue={settingVal?.fourth_member ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Upper Level 5 Member Trading Commission" : "上层5级会员交易佣金"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Upper Level 3 Member Trading Commission (%)" : "上三级会员交易佣金（%"}
                                name="fifth_member"
                                required
                                defaultValue={settingVal?.fifth_member ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Registration Gift Amount" : "报名礼品金额"}</label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Registration Gift Amount" : "报名礼品金额"}
                                name="gift_amount"
                                required
                                defaultValue={settingVal?.gift_amount ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Order Payment Waiting Time" : "订单付款等待时间"} <span>*</span></label>
                            <input
                                type="text"
                                placeholder={authenticatedUser?.language === "en" ? "Order Payment Waiting Time (Second)" : "订单支付等待时间（秒）"}
                                name="payment_waiting_time"
                                required
                                defaultValue={settingVal?.payment_waiting_time ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start">
                            <label>{authenticatedUser?.language === "en" ? "Matching Range" : "匹配范围"} <span>*</span></label>
                            <div className="range-slider-wrapper">
                                <MultiRangeSlider
                                    min={0}
                                    max={100}
                                    step={5}
                                    minValue={minValue}
                                    maxValue={maxValue}
                                    onInput={(e) => {
                                        handleInput(e);
                                    }}
                                />
                                <p className="range_value">{minValue}% - {maxValue}%</p>
                            </div>
                        </div>
                        <div className="create-form-group flex-start setting_time_manager">
                            <label>{authenticatedUser?.language === "en" ? "Withdrawal time" : "提款时间"}</label>
                            <input
                                type="text"
                                name="withdrawalTimeStart"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.withdrawalTimeStart ?? ""}
                            />
                            <p>-</p>
                            <input
                                type="text"
                                name="withdrawalTimeEnd"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.withdrawalTimeEnd ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start setting_time_manager">
                            <label>{authenticatedUser?.language === "en" ? "Recharge time" : "充电时间"}</label>
                            <input
                                type="text"
                                name="rechargeTimeStart"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.rechargeTimeStart ?? ""}
                            />
                            <p>-</p>
                            <input
                                type="text"
                                name="rechargeTimeEnd"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.rechargeTimeEnd ?? ""}
                            />
                        </div>
                        <div className="create-form-group flex-start setting_time_manager">
                            <label>{authenticatedUser?.language === "en" ? "Order grabbing time" : "抢单时间"}</label>
                            <input
                                type="text"
                                name="orderGrabTimeStart"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.orderGrabTimeStart ?? ""}
                            />
                            <p>-</p>
                            <input
                                type="text"
                                name="orderGrabTimeEnd"
                                placeholder="00:00:00"
                                defaultValue={settingVal?.orderGrabTimeEnd ?? ""}
                            />
                        </div>
                        <div className="setting-active-fields">
                            <div className="setting-active-parent">
                                <div className="setting-active-childs">
                                    <p>{authenticatedUser?.language === "en" ? "Mall Status" : "商城状态"}:</p>
                                    <div
                                        className={settingVal.mallStatus ? "class-enabled" : "class-disabled"}
                                        onClick={() => updateTheAppProcess("mallStatus")}
                                    >{settingVal.mallStatus ? `${authenticatedUser?.language === "en" ? "Enabled" : "启用"}` : `${authenticatedUser?.language === "en" ? "Disabled" : "残疾人"}`}</div>
                                    {
                                        settingVal?.mallStatus
                                            ?
                                            <span>{authenticatedUser?.language === "en" ? "ON" : "在"}</span>
                                            :
                                            <span>{authenticatedUser?.language === "en" ? "OFF" : "离开"}</span>
                                    }
                                </div>
                                <div className="setting-active-childs">
                                    <p>{authenticatedUser?.language === "en" ? "Withdrawal" : "提款"}:</p>
                                    <div
                                        className={settingVal.is_withdrawal_allow ? "class-enabled" : "class-disabled"}
                                        onClick={() => updateTheAppProcess("withdrawal")}
                                    >{settingVal.is_withdrawal_allow ? `${authenticatedUser?.language === "en" ? "Enabled" : "启用"}` : `${authenticatedUser?.language === "en" ? "Disabled" : "残疾人"}`}</div>
                                    {
                                        settingVal?.is_withdrawal_allow
                                            ?
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are allow for withdrawal" : "!注意-用户可以提现"}</span>
                                            :
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are not allow for withdrawal" : "!注意-用户不允许提现"}</span>
                                    }
                                </div>
                                <div className="setting-active-childs">
                                    <p>{authenticatedUser?.language === "en" ? "Topup" : "充值"}:</p>
                                    <div
                                        className={settingVal.is_topup_allow ? "class-enabled" : "class-disabled"}
                                        onClick={() => updateTheAppProcess("topup")}
                                    >{settingVal.is_topup_allow ? `${authenticatedUser?.language === "en" ? "Enabled" : "启用"}` : `${authenticatedUser?.language === "en" ? "Disabled" : "残疾人"}`}</div>
                                    {
                                        settingVal?.is_topup_allow
                                            ?
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are allow for top up" : "!注意-用户可以充值"}</span>
                                            :
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are not allow for top up" : "!注意-用户不允许充值"}</span>
                                    }
                                </div>
                                <div className="setting-active-childs">
                                    <p>{authenticatedUser?.language === "en" ? "Order Grabbing" : "抢订单"}:</p>
                                    <div
                                        className={settingVal.is_order_grabing_allow ? "class-enabled" : "class-disabled"}
                                        onClick={() => updateTheAppProcess("order")}
                                    >{settingVal.is_order_grabing_allow ? `${authenticatedUser?.language === "en" ? "Enabled" : "启用"}` : `${authenticatedUser?.language === "en" ? "Disabled" : "残疾人"}`}</div>
                                    {
                                        settingVal?.is_order_grabing_allow
                                            ?
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are allow for order grabing" : "!注意-用户可以抢订单"}</span>
                                            :
                                            <span>{authenticatedUser?.language === "en" ? "!Note - Users are not allow for order grabing" : "!注意-用户不允许抢单"}</span>
                                    }
                                </div>
                                <div className="setting-active-childs">
                                    <p>{authenticatedUser?.language === "en" ? "Alert Sound" : "警报声"}:</p>
                                    <div
                                        className={settingVal.is_alert ? "class-enabled" : "class-disabled"}
                                        onClick={() => updateTheAppProcess("alert")}
                                    >{settingVal.is_alert ? `${authenticatedUser?.language === "en" ? "Enabled" : "启用"}` : `${authenticatedUser?.language === "en" ? "Disabled" : "残疾人"}`}</div>
                                    {
                                        settingVal?.is_alert
                                            ?
                                            <span>{authenticatedUser?.language === "en" ? <>Withdrawal notification enabled <i style={{ color: "#8b8989" }} className="fa fa-volume-up"></i></> : "已启用提款通知"}</span>
                                            :
                                            <span>{authenticatedUser?.language === "en" ? <>Withdrawal notification disabled <i style={{ color: "#8b8989" }} className="fa fa-volume-mute"></i></> : "提款通知已禁用"}</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="create-form-action flex-start">
                            <Submit />
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default SystemSetting;