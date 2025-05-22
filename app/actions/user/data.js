"use server";

import { auth } from "@/app/auth";
import { Role } from "@/modals/Role";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";

export const fetchUser = async (q, qphone, page, startDate, endDate, limit) => {
    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = limit || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    const { user } = await auth();
    const __id = user?.id ?? "";

    try {
        await connectToDB();

        let users;
        let count;

        const authenticatedUser = await User.findById(user?._id);

        if (!authenticatedUser) {
            return {
                message: `User not found!`,
                status: 404,
                type: "danger"
            };
        }

        const allowedPermissions = await Role.find({ role_name: authenticatedUser?.role });
        const allowedPermission = allowedPermissions[0]?.menu_permission;

        if (allowedPermission?.accessAllClient) {
            if (startDate !== "") {
                count = await User.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } },
                        { createdAt: { $gte: start, $lte: end } }
                    ]
                }).count();

                users = await User.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } },
                        { createdAt: { $gte: start, $lte: end } }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            } else {
                count = await User.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } }
                    ]
                }).count();

                users = await User.find({
                    $and: [
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } },
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            }

        } else {
            if (startDate !== "") {
                count = await User.find({
                    $and: [
                        { connected_agent_id: __id },
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } },
                        { createdAt: { $gte: start, $lte: end } }
                    ]
                }).count();

                users = await User.find({
                    $and: [
                        { connected_agent_id: __id },
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } },
                        { createdAt: { $gte: start, $lte: end } }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            } else {
                count = await User.find({
                    $and: [
                        { connected_agent_id: __id },
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } }
                    ]
                }).count();

                users = await User.find({
                    $and: [
                        { connected_agent_id: __id },
                        {
                            username: { $regex: regex },
                            phone_number: { $regex: regexPhone },
                        },
                        { role: { $in: ["user", "practice"] } }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(ITEM_PER_PAGE)
                    .skip(ITEM_PER_PAGE * (page - 1));
            }
        }

        return { users, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchAgent = async (q, qphone, page, startDate, endDate, limit) => {

    const regex = new RegExp(q, "i");
    const regexPhone = new RegExp(qphone, "i");
    const ITEM_PER_PAGE = limit || 10;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    try {
        await connectToDB();

        let count;
        let users;
        if (startDate !== "") {
            count = await User.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                    { role: { $nin: ["user", "practice"] } },
                    { username: { $nin: ["admin", "default"] } },
                    { createdAt: { $gte: start, $lte: end } }
                ]
            }).count();

            users = await User.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                    { role: { $nin: ["user", "practice"] } },
                    { username: { $nin: ["admin", "default"] } },
                    { createdAt: { $gte: start, $lte: end } }
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        } else {
            count = await User.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                    { role: { $nin: ["user", "practice"] } },
                    { username: { $nin: ["admin", "default"] } },
                ]
            }).count();

            users = await User.find({
                $and: [
                    {
                        username: { $regex: regex },
                        phone_number: { $regex: regexPhone },
                    },
                    { role: { $nin: ["user", "practice"] } },
                    { username: { $nin: ["admin", "default"] } },
                ]
            })
                .sort({ createdAt: -1 })
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1));
        }

        return { users, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllAgent = async () => {

    try {
        await connectToDB();

        const agents = await User.find({
            $and: [
                { role: { $nin: ["user", "practice"] } },
                { username: { $ne: "default" } },
                { username: { $ne: "admin" } },
            ]
        });

        return agents;
    } catch (error) {
        console.log(error)
    }
}

export const fetchSystemUser = async (q, page, limit) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = limit || 10;

    try {
        await connectToDB();

        const count = await User.find({
            $and: [
                { username: { $regex: regex } },
                { isAuth: true }
            ]
        }).count();


        const users = await User.find({
            $and: [
                { username: { $regex: regex } },
                { isAuth: true }
            ]
        })
            .sort({ createdAt: 1 })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));

        return { users, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchAuthenticatedUser = async (id) => {

    try {
        await connectToDB();

        const authenticatedUser = await User.findById(id);

        if (!authenticatedUser) {
            return {
                message: `User not found!`,
                status: 404,
                type: "danger"
            };
        }

        return authenticatedUser
    } catch (error) {
        console.log(error)
    }
}




