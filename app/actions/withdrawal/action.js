"use server";

import { auth } from "@/app/auth";
import { AccountChange } from "@/modals/AccountChange";
import { Action } from "@/modals/Action";
import { User } from "@/modals/User";
import { Withdrawal } from "@/modals/Withdrawal";
import { connectToDB } from "@/utils/connection";

export const withdrawalResponse = async (id, respond, withdrawal_amount, iid) => {
    try {
        await connectToDB();
        const { user: loggedInUser } = await auth();

        const releventUserOld = await User.findById(id);

        const withdrawal = await Withdrawal.aggregate([
            { $unwind: "$wallet" },  // Deconstructs the wallet array
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

        const pendingObject = withdrawal?.filter(item => item?.iid === iid)[0];
        const notPending = withdrawal?.filter(item => item?.iid !== iid);

        const newObj = {
            ...pendingObject,
            status: respond
        }

        const updateArray = [...notPending, newObj];

        await Withdrawal.findByIdAndUpdate(withdrawalID, {
            wallet: updateArray
        });

        let message;

        if (respond === "approved") {
            message = "Approved successfully!"

            const releventUser = await User.findById(id);

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: releventUser?.username ?? "",
                phone_number: releventUser?.phone_number ?? "",
                beforeOperation: releventUser?.balance ?? "",
                afterOperation: "Approved" ?? "",
                chnageType: "withdrawalApprove" ?? "",
            });

            await AccountChange.create({
                username: releventUser?.username,
                phone_number: releventUser?.phone_number,
                amount: withdrawal_amount,
                after_operation: releventUser?.balance,
                account_type: "withdrawalApprove"
            });

        } else {
            const releventUser = await User.findById(id);
            const refundedBalance = Number(releventUser?.balance) + Number(withdrawal_amount)
            await User.findByIdAndUpdate(id, {
                balance: refundedBalance
            });

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: releventUser?.username ?? "",
                phone_number: releventUser?.phone_number ?? "",
                beforeOperation: releventUser?.balance ?? "",
                afterOperation: refundedBalance,
                chnageType: "withdrawalRejected" ?? "",
            });

            await AccountChange.create({
                username: releventUser?.username,
                phone_number: releventUser?.phone_number,
                amount: withdrawal_amount,
                after_operation: refundedBalance,
                account_type: "withdrawalReject"
            });

            message = "Rejected successfully, withdrawal amount refunded successfully!"
        }

        return {
            message: message,
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error);
    }
}