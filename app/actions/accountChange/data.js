"use server";

import { connectToDB } from "@/utils/connection";
import { AccountChange } from "@/modals/AccountChange";

export const fetchAccountChange = async (q, qphone, page, startDate, endDate, limit, sortByType) => {
    let sortByTypeValue;

    // const test = await AccountChange.updateMany({
    //     username: "chris"
    // }, {
    //     $set: {
    //         phone_number: "1231231230"
    //     }
    // })
    // console.log(test)

    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = Number(limit) || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    sortByTypeValue = sortByType || "all"

    if (sortByType === "all") {
        sortByTypeValue = "all"
    } else if (sortByType === "credit") {
        sortByTypeValue = "credit"
    } else if (sortByType === "debit") {
        sortByTypeValue = "debit"
    }

    try {
        await connectToDB();

        let accounts;
        let count;

        if (startDate !== "") {
            if (sortByTypeValue === "all") {
                count = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            createdAt: { $gte: start, $lte: end }
                        },
                    ]
                }).count();

                accounts = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            createdAt: { $gte: start, $lte: end }
                        }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            } else {

                count = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            createdAt: { $gte: start, $lte: end },
                            account_type: sortByTypeValue
                        },
                    ]
                }).count();

                accounts = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            createdAt: { $gte: start, $lte: end },
                            account_type: sortByTypeValue
                        },
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            }
        } else {
            if (sortByTypeValue === "all") {
                count = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                    ]
                }).count();

                accounts = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            } else {

                count = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            account_type: sortByTypeValue
                        },
                    ]
                }).count();

                accounts = await AccountChange.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                            account_type: sortByTypeValue
                        },
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            }
        }

        const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
        const totalAmountAfterOperation = accounts.reduce((sum, account) => sum + account.after_operation, 0);

        return { accounts, count, totalAmount, totalAmountAfterOperation };
    } catch (error) {
        console.log(error)
    }
}