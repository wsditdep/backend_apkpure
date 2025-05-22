"use server";

import { AccountChange } from "@/modals/AccountChange";
import { Pop } from "@/modals/Pop";
import { Setting } from "@/modals/Setting";
import { Support } from "@/modals/Support";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";

export const updateSetting = async (formData) => {
    const {
        id,
        title,
        first_member,
        second_member,
        third_member,
        fourth_member,
        fifth_member,
        gift_amount,
        payment_waiting_time,
        matching_range_min,
        matching_range_max,
        withdrawalTimeStart,
        withdrawalTimeEnd,
        rechargeTimeStart,
        rechargeTimeEnd,
        orderGrabTimeStart,
        orderGrabTimeEnd,
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const updateFields = {
            id,
            title,
            first_member,
            second_member,
            third_member,
            fourth_member,
            fifth_member,
            gift_amount,
            payment_waiting_time,
            matching_range_min,
            matching_range_max,
            withdrawalTimeStart,
            withdrawalTimeEnd,
            rechargeTimeStart,
            rechargeTimeEnd,
            orderGrabTimeStart,
            orderGrabTimeEnd,
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Setting.findByIdAndUpdate(id, updateFields);

        if (matching_range_min || matching_range_max) {
            await User.updateMany({}, {
                $set: {
                    match_min: matching_range_min,
                    match_max: matching_range_max
                }
            });
        }

        return {
            message: "Setting updated successfully",
            status: 201,
            type: "success"
        };

    } catch (err) {
        console.log(err);
    }
};

export const UpdateAllowOperation = async (formData) => {
    const {
        id,
        type,
    } = Object.fromEntries(formData);
    try {
        await connectToDB();

        const oldData = await Setting.findById(id);

        if (!oldData) return {
            message: "Data not found!",
            status: 404,
            type: "danger"
        };

        if (type === "withdrawal") {
            let isVal;

            if (oldData?.is_withdrawal_allow === true) {
                isVal = false
            } else {
                isVal = true
            }

            await Setting.findByIdAndUpdate(id, {
                is_withdrawal_allow: isVal
            });
        } else if (type === "mallStatus") {

            let isVal;

            if (oldData?.mallStatus === true) {
                isVal = false
            } else {
                isVal = true
            }

            await Setting.findByIdAndUpdate(id, {
                mallStatus: isVal
            });
        }
        else if (type === "topup") {

            let isVal;

            if (oldData?.is_topup_allow === true) {
                isVal = false
            } else {
                isVal = true
            }

            await Setting.findByIdAndUpdate(id, {
                is_topup_allow: isVal
            });
        } else if (type === "alert") {

            let isVal;

            if (oldData?.is_alert === true) {
                isVal = false
            } else {
                isVal = true
            }

            await Setting.findByIdAndUpdate(id, {
                is_alert: isVal
            });
        } else {

            let isVal;

            if (oldData?.is_order_grabing_allow === true) {
                isVal = false
            } else {
                isVal = true
            }

            await Setting.findByIdAndUpdate(id, {
                is_order_grabing_allow: isVal
            });
        }

        return {
            message: "Setting updated successfully",
            status: 201,
            type: "success"
        };

    } catch (err) {
        console.log(err);
    }

};

export const updateSupportInfo = async (formData) => {

    const {
        id,
        mobile_number,
        live_chat,
        we_chat,
        work_time,
        link
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const updateFields = {
            mobile_number,
            live_chat,
            we_chat,
            work_time,
            link
        }

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Support.findByIdAndUpdate(id, updateFields);

        return {
            message: "Saved",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const updatePop = async (formData) => {

    const {
        image,
        visibility,
        animationType,
        animationDuration,
        animationTimingFunction
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const isObject = await Pop.findOne();

        if (!isObject) {
            await Pop.create({
                image,
                visibility,
                animationType,
                animationDuration,
                animationTimingFunction
            })

        } else {
            const updateFields = {
                image,
                visibility,
                animationType,
                animationDuration,
                animationTimingFunction
            }

            const _iid = isObject?._id;

            await Pop.findByIdAndUpdate(_iid, updateFields);
        }

        return {
            message: "Notification saved",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }

}