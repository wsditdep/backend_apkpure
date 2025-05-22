"use server";

import { connectToDB } from "@/utils/connection";
import { Order } from "@/modals/Order";
import { Action } from "@/modals/Action";

export const fetchOrders = async (q, qphone, page, limit, startDate, endDate) => {
    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = Number(limit) || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    try {
        await connectToDB();

        let count;
        let orders;
        if (startDate !== "") {
            count = await Order.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                        createdAt: { $gte: start, $lte: end }
                    },
                ]
            }).count();

            orders = await Order.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                        createdAt: { $gte: start, $lte: end }
                    },
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        } else {
            count = await Order.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                ]
            }).count();

            orders = await Order.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        }


        return { orders, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchActivities = async (q, qphone, page, limit, startDate, endDate) => {
    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = Number(limit) || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    try {
        await connectToDB();

        let count;
        let activity;
        if (startDate !== "") {
            count = await Action.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                        createdAt: { $gte: start, $lte: end }
                    },
                ]
            }).count();

            activity = await Action.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                        createdAt: { $gte: start, $lte: end }
                    },
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        } else {
            count = await Action.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                ]
            }).count();

            activity = await Action.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        }


        return { activity, count };
    } catch (error) {
        console.log(error)
    }
}