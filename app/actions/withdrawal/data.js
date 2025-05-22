"use server";

import { Withdrawal } from "@/modals/Withdrawal";
import { connectToDB } from "@/utils/connection";

export const fetchWithdrawal = async (q, qphone, page, startDate, endDate, limit) => {

    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = Number(limit) || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    try {
        await connectToDB();
        let count;
        let withdrawal;
        if (startDate !== "") {
            const countResult = await Withdrawal.aggregate([
                { $unwind: "$wallet" },
                {
                    $match: {
                        "wallet.username": regex,
                        "wallet.phone_number": regexPhone,
                        "wallet.createdAt": { $gte: start, $lte: end }
                    }
                },
                {
                    $count: "totalCount"
                }
            ]);

            count = countResult.length > 0 ? countResult[0].totalCount : 0;

            withdrawal = await Withdrawal.aggregate([
                { $unwind: "$wallet" },
                {
                    $match: {
                        "wallet.username": regex,
                        "wallet.phone_number": regexPhone,
                        "wallet.createdAt": { $gte: start, $lte: end }
                    }
                },
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
                        "withdrawal_updatedAt": "$updatedAt"
                    }
                },
                { $sort: { "withdrawal_createdAt": -1 } },
                { $skip: ITEM_PER_PAGE * (page - 1) },
                { $limit: ITEM_PER_PAGE }
            ]);
        } else {

            const countResult = await Withdrawal.aggregate([
                { $unwind: "$wallet" },
                {
                    $match: {
                        "wallet.username": regex,
                        "wallet.phone_number": regexPhone,
                    }
                },
                {
                    $count: "totalCount"
                }
            ]);


            count = countResult.length > 0 ? countResult[0].totalCount : 0;

            withdrawal = await Withdrawal.aggregate([
                { $unwind: "$wallet" },
                {
                    $match: {
                        "wallet.username": regex,
                        "wallet.phone_number": regexPhone,
                    }
                },
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
                        "withdrawal_updatedAt": "$updatedAt"
                    }
                },
                { $sort: { "wallet_createdAt": -1 } },
                { $skip: ITEM_PER_PAGE * (page - 1) },
                { $limit: ITEM_PER_PAGE }
            ]);
        }
        
        return { withdrawal, count };

    } catch (error) {
        console.log(error)
    }
}

export const fetchWithdrawalCount = async () => {
    try {
        await connectToDB();

        const pendingCount = await Withdrawal.aggregate([
            { $unwind: "$wallet" },  //
            { $match: { "wallet.status": "pending" } },
            {
                $project: {
                    "id": "$wallet.id",
                    "username": "$wallet.username",
                    "phone_number": "$wallet.phone_number",
                    "wallet_name": "$wallet.wallet_name",
                    "withdrawal_amount": "$wallet.withdrawal_amount",
                    "wallet_address": "$wallet.wallet_address",
                    "network_type": "$wallet.network_type",
                    "status": "$wallet.status",
                    "wallet_createdAt": "$wallet.createdAt",
                    "wallet_updatedAt": "$wallet.updatedAt",
                    "withdrawal_createdAt": "$createdAt",
                    "withdrawal_updatedAt": "$updatedAt"
                }
            },
            { $count: "pendingCount" }
        ]);


        const withdrawal = pendingCount[0]?.pendingCount || 0;

        return withdrawal;

    } catch (error) {
        console.log(error)
    }
}