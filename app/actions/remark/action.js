"use server";

import { Recharge } from "@/modals/Recharge";
import { Withdrawal } from "@/modals/Withdrawal";
import { connectToDB } from "@/utils/connection";

export const updateRemark = async (formData) => {

    const { id, remark } = Object.fromEntries(formData);

    if (!id) {
        return {
            message: "Not Found",
            status: 404,
            type: "danger",
        };
    }

    try {
        await connectToDB();

        const updateFields = {
            id,
            remark
        };

        await Recharge.findByIdAndUpdate(id, updateFields);

        return {
            message: "Remark updated successfully",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const withdrawalRemarkUpdate = async (formData) => {
    const { id, iid, remark } = Object.fromEntries(formData);
    try {
        await connectToDB();

        const withdrawal = await Withdrawal.aggregate([
            { $unwind: "$wallet" },
            {
                $project: {
                    "id": "$wallet.id",
                    "iid": "$wallet.iid",
                    "username": "$wallet.username",
                    "phone_number": "$wallet.phone_number",
                    "wallet_name": "$wallet.wallet_name",
                    "withdrawal_amount": "$wallet.withdrawal_amount",
                    "wallet_address": "$wallet.wallet_address",
                    "network_type": "$wallet.network_type",
                    "currency": "$wallet.currency",
                    "status": "$wallet.status",
                    "remark": "$wallet.remark",
                    "wallet_createdAt": "$wallet.createdAt",
                    "wallet_updatedAt": "$wallet.updatedAt",
                    "withdrawal_createdAt": "$createdAt",
                    "withdrawal_updatedAt": "$updatedAt",
                    "createdAt": "$wallet.createdAt",
                    "updatedAt": "$wallet.updatedAt",
                }
            },
            { $match: { "id": id } }
        ]);

        const withdrawalID = withdrawal[0]?._id;

        const findModifiedObject = withdrawal?.filter(item => item?.iid === iid)[0];
        const notMatched = withdrawal?.filter(item => item?.iid !== iid);

        const newObj = {
            ...findModifiedObject,
            remark: remark
        }

        const updateArray = [...notMatched, newObj];

        await Withdrawal.findByIdAndUpdate(withdrawalID, {
            wallet: updateArray
        });

        return {
            message: "Updated Successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error);
    }
}