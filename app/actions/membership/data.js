"use server";

import { Commission } from "@/modals/Commission";
import { LoginHistory } from "@/modals/LogHistory";
import { SystemLogHistory } from "@/modals/SystemLogHistory";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection"

export const fetchMembership = async () => {
    try {
        connectToDB();

        const membership = await Commission.find().sort({ commission_rate: 1 });

        return membership;
    } catch (error) {
        console.log(error)
    }
}

export const fetchSingleMembership = async (id) => {
    try {
        connectToDB();

        const membership = await Commission.findById(id);

        return membership;
    } catch (error) {
        console.log(error)
    }
}

export const fetchLoginHistory = async (q, qphone, ip, page, limit) => {

    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const regexIP = new RegExp(ip, "i");
    const ITEM_PER_PAGE = limit || 10;

    try {
        connectToDB();

        const count = await LoginHistory.find({
            $and: [
                {
                    username: { $regex: regex },
                    phone_number: { $regex: regexPhone },
                    ip_address: { $regex: regexIP },
                }
            ]
        }).count();

        const logs = await LoginHistory.find({
            $and: [
                {
                    username: { $regex: regex },
                    phone_number: { $regex: regexPhone },
                    ip_address: { $regex: regexIP },
                }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));

        return { logs, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchAdminLoginHistory = async (q, qphone, ip, page, limit) => {

    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const regexIP = new RegExp(ip, "i");
    const ITEM_PER_PAGE = limit || 10;

    try {
        connectToDB();

        const count = await SystemLogHistory.find({
            $and: [
                {
                    username: { $regex: regex },
                    phone_number: { $regex: regexPhone },
                    ip_address: { $regex: regexIP },
                }
            ]
        }).count();

        const logs = await SystemLogHistory.find({
            $and: [
                {
                    username: { $regex: regex },
                    phone_number: { $regex: regexPhone },
                    ip_address: { $regex: regexIP },
                }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));

        return { logs, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchRoleDetails = async () => {
    try {
        connectToDB();

        const roles = await User.aggregate([
            {
                $group: {
                    _id: "$role", // Group by the 'role' field
                    count: { $sum: 1 }, // Count occurrences of each role
                },
            },
            {
                $project: {
                    role: "$_id", // Rename '_id' to 'role'
                    count: 1,
                    _id: 0, // Exclude the original '_id' field
                },
            },
        ]);


        return roles;
    } catch (error) {
        console.log(error)
    }
}