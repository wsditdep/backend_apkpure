"use server";

import { Commission } from "@/modals/Commission";
import { Order } from "@/modals/Order";
import { Product } from "@/modals/Product";
import { Recharge } from "@/modals/Recharge";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";

export const getAnalytics = async () => {
    try {
        await connectToDB();

        const activeUsers = await User.find().count() || 0;
        const admin = await User.find({ role: "admin" }).count() || 0;
        const userAccount = await User.find({ role: "user" }).count() || 0;
        const practiceAccount = await User.find({ role: "practice" }).count() || 0;
        const availableProducts = await Product.find().count() || 0;
        const orderReceived = await Order.find().count() || 0;
        const membershipLevel = await Commission.find().count() || 0;
        const noOfTransaction = await Recharge.find().count() || 0;

        const data = {
            activeUsers,
            admin,
            userAccount,
            practiceAccount,
            availableProducts,
            orderReceived,
            membershipLevel,
            noOfTransaction
        }

        return {
            message: "Fetched!",
            status: 201,
            type: "danger",
            data: data
        }
    } catch (error) {
        console.log(error)
    }
}