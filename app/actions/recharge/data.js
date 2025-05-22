"use server";

import { connectToDB } from "@/utils/connection";
import { Recharge } from "@/modals/Recharge";

export const fetchRecharge = async (q, page, startDate, endDate, limit) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = limit || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    try {
        await connectToDB();

        let count;
        let recharge;
        if (startDate !== "") {
            count = await Recharge.find().count();
            recharge = await Recharge.find({
                $and: [
                    { username: { $regex: regex } },
                    { createdAt: { $gte: start, $lte: end } }
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));

        } else {

            count = await Recharge.find().count();
            recharge = await Recharge.find({
                $and: [
                    { username: { $regex: regex } }
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        }

        return { recharge, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchRechargeOnly = async () => {

    try {
        await connectToDB();

        const topup = await Recharge.find().sort({ createdAt: -1 }).limit(10)

        return topup;
    } catch (error) {
        console.log(error)
    }
}