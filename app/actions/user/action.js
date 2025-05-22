"use server";

import { Commission } from "@/modals/Commission";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";
import generateReferralCode from "@/utils/generateRefCode";
import generateSecurityCode from "@/utils/generateSecurityCode";
import generateUniqueId from "@/utils/generateid";
import { auth, signIn, signOut } from "@/app/auth";
import bcrypt from "bcryptjs";
import { JourneyHistory } from "@/modals/JourneyHistory";
import { Recharge } from "@/modals/Recharge";
import mongoose from "mongoose";
import { AccountChange } from "@/modals/AccountChange";
import { Setting } from "@/modals/Setting";
import { Withdrawal } from "@/modals/Withdrawal";
import { Action } from "@/modals/Action";

export const authenticate = async (formData) => {

    await connectToDB();

    const { username, password, did } = Object.fromEntries(formData);

    if (!username) return {
        message: "Please enter username",
        status: 404,
        type: "danger"
    };

    if (!password) return {
        message: "Please enter password",
        status: 404,
        type: "danger"
    };

    // check account is blocked or suspended
    const user = await User.findOne({
        $or: [
            { username: username },
            { phone_number: username }
        ]
    });

    if (!user) return {
        message: `User not found. Please register before login!`,
        status: 404,
        type: "danger"
    };

    if (!user?.status) return {
        message: `User has been banned`,
        status: 501,
        type: "danger"
    };

    try {

        await signIn("credentials", { username, password, did });
        return {
            message: "Logged in successfully",
            status: 201,
            type: "success"
        };

    } catch (err) {
        if (err.message.includes("CredentialsSignin")) {
            return {
                message: `Invalid username or password!, try again!`,
                status: 404,
                type: "danger"
            };
        }
        throw err;
    }
};

export const logout = async () => {
    try {
        await signOut();
    } catch (err) {
        console.log(err)
    }
};

export const createUser = async (formData) => {

    try {
        await connectToDB();

        let {
            // id,
            username,
            role,
            parent_id,
            phone_number,
            balance,
            // daily_available_order,
            // today_order,
            // today_commission,
            // parent_user,
            // invitation_code,
            // status,
            membership_level,
            // froze_amount,
            // wallet_address,
            withdrawal_pin,
            password,
            // network_type,
            match_min,
            match_max,
            allow_withdrawal,
            allow_rob_order,
            connected_agent_username,
            number_of_draws,
            winning_amount,
            min_withdrawal_amount,
            max_withdrawal_amount,
            withdrawal_needed_order
            // security_code,
            // admin_passcode
        } = Object.fromEntries(formData);

        const isUser = await User.findOne({ username: username });

        if (isUser) return {
            message: "Username already taken, please select different username",
            status: 404,
            type: "danger"
        };

        if (role !== "superAdmin") {
            const isPhone = await User.findOne({ phone_number: phone_number });

            if (isPhone) return {
                message: "Phone number is already used!",
                status: 404,
                type: "danger"
            };
        }

        let parent__id;
        let daily_available_order;
        let today_order;
        let today_commission;
        let parent_user;
        let status;
        let froze_amount;
        let wallet_address;
        let network_type;
        let connected_agent_id;

        let practiceWalletName;
        let practiceWalletAddress;
        let practiceWalletPhoneNumber;
        let practiceWalletCurrency;
        let practiceWalletNetworkType;


        let parentInfo;
        if (role === "user") {
            parentInfo = await User.findOne({ id: parent_id });

            if (!parentInfo) return {
                message: "Invalid parent id!",
                status: 404,
                type: "danger"
            };

            parent_user = parentInfo.username;
            parent__id = parentInfo.id;
        } else if (role === "practice") {
            const parentInfos = await User.findOne({ id: parent_id });
            parentInfo = await User.findOne({ id: parentInfos?.connected_agent_id });

            if (!parentInfo) return {
                message: "Invalid parent id!",
                status: 404,
                type: "danger"
            };

            parent_user = parentInfos?.username;
            parent__id = parentInfos?.id;
            connected_agent_id = parentInfos?.connected_agent_id;

            practiceWalletName = parentInfo?.wallet_name;
            practiceWalletAddress = parentInfo?.wallet_address;
            practiceWalletPhoneNumber = parentInfo?.wallet_phone;
            practiceWalletCurrency = parentInfo?.currency;
            practiceWalletNetworkType = parentInfo?.network_type;
        }
        else if (role === "agent") {
            parentInfo = await User.findOne({ username: "default" });

            if (!parentInfo) return {
                message: "Invalid parent id!",
                status: 404,
                type: "danger"
            };

            parent_user = parentInfo.username;
            parent__id = parentInfo.id;
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        // generating unique values
        const id = await generateUniqueId();
        const security_code = await generateSecurityCode();
        const invitation_code = await generateReferralCode();

        let membership_info;
        if (role === "user" || role === "practice") {
            membership_info = await Commission.findOne({ membership_name: membership_level });

            if (!membership_info) return {
                message: "Membership not found!",
                status: 404,
                type: "danger"
            };
        } else if (role === "agent") {
            const defaultMembership = await Commission.findOne().sort({ commission_rate: 1 });
            if (!defaultMembership) return {
                message: "Membership not found!",
                status: 404,
                type: "danger"
            };
            membership_info = defaultMembership;
        }

        if (role === "practice") {
            daily_available_order = membership_info.order_quantity;
            today_order = 0;
            today_commission = 0;
            // parent_user = parentInfo?.username;
            status = true;
            froze_amount = 0;
            wallet_address = null;
            network_type = null;
            match_min = 30;
            match_max = 70;
            allow_withdrawal = allow_withdrawal;
            connected_agent_id = parentInfo?.id;
        } else if (role === "user") {
            daily_available_order = membership_info.order_quantity;
            today_order = 0;
            today_commission = 0;
            parent_user = parentInfo?.username;
            status = true;
            froze_amount = 0;
            wallet_address = null;
            network_type = null;
            match_min = 30;
            match_max = 70;
            allow_withdrawal = true;
            connected_agent_id = parentInfo?.id;
        } else if (role === "agent") {
            daily_available_order = membership_info.order_quantity;
            today_order = 0;
            today_commission = 0;
            status = true;
            froze_amount = 0;
            wallet_address = null;
            network_type = null;
            connected_agent_id = parentInfo?.id;
        }

        const setting = await Setting.findOne();

        let accountBalance;
        if (balance === "") {
            accountBalance = Number(setting?.gift_amount)
        } else {
            accountBalance = Number(balance) + Number(setting?.gift_amount)
        }

        let newUser;
        if (role === "agent") {
            newUser = new User({
                id,
                username,
                role,
                parent_id: parent__id,
                phone_number,
                balance: accountBalance || 0,
                daily_available_order,
                today_order,
                today_commission,
                parent_user,
                invitation_code,
                status,
                membership_level: membership_info?.membership_name,
                froze_amount,
                wallet_address,
                withdrawal_pin,
                network_type,
                match_min: setting?.matching_range_min || 30,
                match_max: setting?.matching_range_max || 70,
                allow_withdrawal,
                allow_rob_order,
                security_code,
                password: hasedPassword,
                connected_agent_username,
                connected_agent_id,
                min_withdrawal_amount,
                max_withdrawal_amount,
                withdrawal_needed_order
            });
        } else if (role === "practice") {
            newUser = new User({
                id,
                username,
                role,
                parent_id: parent__id,
                phone_number,
                balance: accountBalance || 0,
                daily_available_order,
                today_order,
                today_commission,
                parent_user,
                invitation_code,
                status,
                membership_level,
                froze_amount,
                wallet_name: practiceWalletName,
                wallet_address: practiceWalletAddress,
                currency: practiceWalletCurrency,
                wallet_phone: practiceWalletPhoneNumber,
                withdrawal_pin,
                network_type: practiceWalletNetworkType,
                match_min: setting?.matching_range_min || 30,
                match_max: setting?.matching_range_max || 70,
                allow_withdrawal,
                allow_rob_order,
                security_code,
                password: hasedPassword,
                connected_agent_username,
                connected_agent_id,
                number_of_draws,
                winning_amount: JSON.parse(winning_amount),
                min_withdrawal_amount,
                max_withdrawal_amount,
                withdrawal_needed_order
            });

        }
        else {
            newUser = new User({
                id,
                username,
                role,
                parent_id: parent__id,
                phone_number,
                balance: accountBalance || 0,
                daily_available_order,
                today_order,
                today_commission,
                parent_user,
                invitation_code,
                status,
                membership_level,
                froze_amount,
                wallet_address,
                withdrawal_pin,
                network_type,
                match_min: setting?.matching_range_min || 30,
                match_max: setting?.matching_range_max || 70,
                allow_withdrawal,
                allow_rob_order,
                security_code,
                password: hasedPassword,
                connected_agent_username,
                connected_agent_id,
                number_of_draws,
                winning_amount: JSON.parse(winning_amount),
                min_withdrawal_amount,
                max_withdrawal_amount,
                withdrawal_needed_order
            });
        }

        const res = await newUser.save();

        if (role === "practice") {
            if (balance !== "") {
                if (res) {
                    await AccountChange.create({
                        username: res?.username,
                        phone_number: res?.phone_number,
                        amount: 0,
                        after_operation: balance,
                        account_type: "credit"
                    });
                }
            }
        }

        return {
            message: "User added successfully",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const deleteUser = async (id) => {

    try {
        connectToDB();

        if (!id) return {
            message: "User not found!",
            status: 404,
            type: "danger"
        };

        await User.findByIdAndUpdate(id, {
            isAuth: false,
            connected_agent_username: null,
            role: "agent",
            agent_username: null,
        });

        return {
            message: "User deleted successfully",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const updateUser = async (formData) => {

    const {
        id,
        username,
        membership_level,
        parent_id,
        balance,
        today_commission,
        froze_amount,
        phone_number,
        match_min,
        match_max,
        password,
        withdrawal_pin,
        credibility,
        allow_withdrawal,
        allow_rob_order,
        number_of_draws,
        winning_amount,
        min_withdrawal_amount,
        max_withdrawal_amount,
        withdrawal_needed_order,
        lastUpdate
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const { user: loggedInUser } = await auth();

        const objectId = new mongoose.Types.ObjectId(id);

        const currentUser = await User.findById(id);

        // check for data change
        const lastUpdateDate = new Date(lastUpdate);
        const updatedAtDate = currentUser?.updatedAt

        if (lastUpdateDate.getTime() !== updatedAtDate.getTime()) return {
            message: "Data changes found. Please refresh and try again.",
            status: 409,
            type: "danger"
        };

        const isParentValid = await User.findOne({ id: parent_id });

        let parent_iid = parent_id;

        if (!isParentValid) {
            return {
                message: "Invalid Parent ID",
                status: 404,
                type: "danger"
            };
        }

        let newUsername;

        if (!currentUser) {
            return {
                message: "User not found.",
                status: 404,
                type: "danger"
            };
        }

        if (username && username !== currentUser.username) {
            const isUsernameAvailable = await User.findOne({ username: username });

            if (isUsernameAvailable) {
                return {
                    message: `"${username}" is not available. Please try a different username!`,
                    status: 404,
                    type: "danger"
                };
            } else {
                newUsername = username;
            }

        } else {
            newUsername = "";
        }

        let connected_agent_id;
        let parent__id;
        let parent_username

        if (currentUser?.role === "user") {

            const parentUser = await User.findOne({ id: parent_id });

            if (!parentUser) return {
                message: `User not found`,
                status: 404,
                type: "danger"
            };

            parent__id = parentUser?.id
            parent_username = parentUser?.username
            connected_agent_id = parentUser?.id

        } else if (currentUser?.role === "practice") {

            const parentUser = await User.findOne({ id: parent_id });
            const mainParent = await User.findOne({ id: parentUser?.connected_agent_id });

            if (!parentUser) return {
                message: `User not found`,
                status: 404,
                type: "danger"
            };

            parent__id = parentUser?.id;
            parent_username = parentUser?.username;
            connected_agent_id = mainParent?.id;

        } else {
            const parentUser = await User.findOne({ id: parent_id });

            if (!parentUser) return {
                message: `User not found`,
                status: 404,
                type: "danger"
            };

            parent__id = parentUser?.id
            connected_agent_id = parentUser?.id
            parent_username = parentUser?.username
        }

        const commissionLevel = await Commission.findOne({ membership_name: membership_level });

        const newSecurityCode = await generateSecurityCode();

        // check topup time
        if (balance || today_commission || froze_amount) {
            const setting = await Setting.findOne();
            const allowTopup = setting?.is_topup_allow;

            if (!allowTopup) return {
                message: `Balance, Today Commission and Freeze amount can not be edited at this moment, please contact your team leader.`,
                status: 404,
                type: "danger"
            };
        }

        if (password === "") {
            const updateFields = {
                username: newUsername,
                membership_level,
                parent_id: parent_id,
                parent_user: isParentValid?.username,
                balance,
                daily_available_order: commissionLevel?.order_quantity,
                today_commission,
                froze_amount,
                phone_number,
                match_min,
                match_max,
                password,
                withdrawal_pin,
                credibility,
                allow_withdrawal,
                allow_rob_order,
                number_of_draws,
                winning_amount: JSON.parse(winning_amount),
            }

            Object.keys(updateFields).forEach(
                (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
            );

            const newData = {
                ...updateFields,
                min_withdrawal_amount,
                max_withdrawal_amount,
                withdrawal_needed_order,
            }

            await User.findByIdAndUpdate(objectId, newData);

        } else {

            const hasedPassword = await bcrypt.hash(password, 10);

            const updateFields = {
                username: newUsername,
                membership_level,
                parent_id,
                parent_user: isParentValid?.username,
                balance,
                daily_available_order: commissionLevel?.order_quantity,
                froze_amount,
                today_commission,
                phone_number,
                match_min,
                match_max,
                password: hasedPassword,
                withdrawal_pin,
                credibility,
                security_code: newSecurityCode,
                allow_withdrawal,
                allow_rob_order,
                number_of_draws,
                winning_amount: JSON.parse(winning_amount),
            }

            Object.keys(updateFields).forEach(
                (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
            );

            const newData = {
                ...updateFields,
                min_withdrawal_amount,
                max_withdrawal_amount,
                withdrawal_needed_order,
            }

            await User.findByIdAndUpdate(objectId, newData);

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: "****" ?? "",
                afterOperation: password ?? "",
                chnageType: "password" ?? "",
            });
        }

        // activities
        if (currentUser?.username !== username) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.username ?? "",
                afterOperation: username ?? "",
                chnageType: "username" ?? "",
            });

            const res = await AccountChange.updateMany({ username: currentUser?.username }, {
                $set: {
                    username: username,
                }
            });
        }

        if (currentUser?.membership_level !== membership_level) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.membership_level ?? "",
                afterOperation: membership_level ?? "",
                chnageType: "memberlevel" ?? "",
            });
        }

        if (currentUser?.parent_id !== Number(parent_iid)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.parent_id ?? "",
                afterOperation: parent_id ?? "",
                chnageType: "parentid" ?? "",
            });
        }

        if (currentUser?.phone_number !== phone_number) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.phone_number ?? "",
                afterOperation: phone_number ?? "",
                chnageType: "phone_number" ?? "",
            });

            await AccountChange.updateMany({ username: username }, {
                $set: {
                    phone_number: phone_number,
                }
            });
        }

        if (currentUser?.credibility !== Number(credibility)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.credibility ?? "",
                afterOperation: credibility ?? "",
                chnageType: "credibility" ?? "",
            });
        }

        if (currentUser?.balance !== Number(balance)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.balance ?? "",
                afterOperation: balance ?? "",
                chnageType: "balance" ?? "",
            });
        }

        if (currentUser?.froze_amount !== Number(froze_amount)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.froze_amount ?? "",
                afterOperation: froze_amount ?? "",
                chnageType: "frozeAmount" ?? "",
            });
        }

        if (currentUser?.today_commission !== Number(today_commission)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.today_commission ?? "",
                afterOperation: today_commission ?? "",
                chnageType: "todayCommission" ?? "",
            });
        }

        if (currentUser?.min_withdrawal_amount !== min_withdrawal_amount) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.min_withdrawal_amount ?? "",
                afterOperation: min_withdrawal_amount ?? "",
                chnageType: "min_withdrawal_amount" ?? "",
            });
        }

        if (currentUser?.max_withdrawal_amount !== max_withdrawal_amount) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.max_withdrawal_amount ?? "",
                afterOperation: max_withdrawal_amount ?? "",
                chnageType: "max_withdrawal_amount" ?? "",
            });
        }

        if (currentUser?.withdrawal_needed_order !== withdrawal_needed_order) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.withdrawal_needed_order ?? "",
                afterOperation: withdrawal_needed_order ?? "",
                chnageType: "withdrawal_needed_order" ?? "",
            });
        }

        if (currentUser?.match_min !== Number(match_min)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.match_min ?? "",
                afterOperation: match_min ?? "",
                chnageType: "match_min" ?? "",
            });
        }

        if (currentUser?.match_max !== Number(match_max)) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.match_max ?? "",
                afterOperation: match_max ?? "",
                chnageType: "match_max" ?? "",
            });
        }

        if (currentUser?.withdrawal_pin !== withdrawal_pin) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.withdrawal_pin ?? "",
                afterOperation: withdrawal_pin ?? "",
                chnageType: "withdrawal_pin" ?? "",
            });
        }

        if (String(currentUser?.allow_withdrawal) !== allow_withdrawal) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.allow_withdrawal ? "Enable" : "Disable",
                afterOperation: allow_withdrawal === "true" ? "Enable" : "Disable",
                chnageType: "allow_withdrawal",
            });
        }

        if (String(currentUser?.allow_rob_order) !== allow_rob_order) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: currentUser?.allow_rob_order ? "Enable" : "Disable",
                afterOperation: allow_rob_order === "true" ? "Enable" : "Disable",
                chnageType: "allow_rob_order",
            });
        }

        return {
            message: "User updated successfully",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }

}

export const updateSystemUser = async (formData) => {

    const {
        id,
        username,
        password,
        role,
        connected_agent_username
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const objectId = new mongoose.Types.ObjectId(id);

        const user = await User.findOne({
            $and: [
                { _id: id },
                { role: { $nin: ["user", "practice"] } }
            ]
        });

        if (!user) return {
            message: "User not found!",
            status: 404,
            type: "danger"
        };

        let newUsername;
        if (username !== user?.agent_username) {

            const isUsernameAvailable = await User.findOne({
                $and: [
                    { agent_username: username },
                    { role: { $nin: ["user", "practice", "agent"] } }
                ]
            });

            if (isUsernameAvailable) {
                return {
                    message: `"${username}" is not available. Please try a different username!`,
                    status: 404,
                    type: "danger"
                };
            } else {
                newUsername = username;
            }

        } else {
            newUsername = "";
        }

        const newSecurityCode = await generateSecurityCode();

        if (password === "") {
            const updateFields = {
                role,
                agent_username: username,
                connected_agent_username: connected_agent_username
            }

            Object.keys(updateFields).forEach(
                (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
            );

            await User.findByIdAndUpdate(objectId, updateFields);

        } else {

            const hasedPassword = await bcrypt.hash(password, 10);

            const updateFields = {
                role,
                agent_username: username,
                connected_agent_username: connected_agent_username,
                password: hasedPassword,
                security_code: newSecurityCode
            }

            Object.keys(updateFields).forEach(
                (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
            );

            await User.findByIdAndUpdate(objectId, updateFields);
        }

        return {
            message: "User updated successfully",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }

}

// export const createSystemUser = async (formData) => {

//     const {
//         username,
//         password,
//         role,
//         connected_agent_username
//     } = Object.fromEntries(formData);

//     try {
//         await connectToDB();

//         if (!username || !password || !role || !connected_agent_username) return {
//             message: "Please provide all information!",
//             status: 404,
//             type: "danger"
//         };

//         const objectId = new mongoose.Types.ObjectId(user?._id);

//         const newSecurityCode = await generateSecurityCode();

//         const hasedPassword = await bcrypt.hash(password, 10);

//         const updateFields = {
//             username,
//             role,
//             connected_agent_username,
//             password: hasedPassword,
//             security_code: newSecurityCode
//         }

//         Object.keys(updateFields).forEach(
//             (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
//         );

//         await User.findByIdAndUpdate(objectId, updateFields);

//         return {
//             message: "New user added successfully!",
//             status: 201,
//             type: "success"
//         };

//     } catch (error) {
//         console.log(error)
//     }

// }

export const createSystemUser = async (formData) => {

    try {
        await connectToDB();

        let {
            username,
            role,
            password,
            connected_agent_username,
        } = Object.fromEntries(formData);

        if (!role || !password || !connected_agent_username) return {
            message: "Required field is missing!",
            status: 404,
            type: "danger"
        };

        const isUserAlreadyAvailable = await User?.findOne({ agent_username: username });

        if (isUserAlreadyAvailable) return {
            message: `This agent is already added!`,
            status: 404,
            type: "danger"
        };

        const agentInfo = await User.findOne({ username: connected_agent_username });

        if (!agentInfo) return {
            message: `Agent not found!`,
            status: 404,
            type: "danger"
        };

        const hasedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(agentInfo?._id, {
            agent_username: username,
            connected_agent_username: connected_agent_username,
            password: hasedPassword,
            role: role,
            isAuth: true,
        });

        return {
            message: "Administrator successfully added to the system!",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const rechargeAccount = async (formData) => {

    const { type, amount, _id, remark } = Object.fromEntries(formData);
    const { user: sessionUser } = await auth();

    try {
        await connectToDB();

        const user = await User.findById(_id);

        if (!user) {
            return {
                message: `Something went wrong!`,
                status: 404,
                type: "danger"
            };
        }

        // check topup is enabled or disabled
        const setting = await Setting.findOne();
        if (!setting) return {
            message: `Something went wrong!`,
            status: 404,
            type: "danger"
        };

        if (setting?.is_topup_allow === false) return {
            message: `Topup is disabled, contact your team leader!`,
            status: 404,
            type: "danger"
        };

        if (setting?.is_topup_allow === false) return {
            message: `Topup is disabled, contact your team leader!`,
            status: 404,
            type: "danger"
        };

        // const topUpAllowed = await checkTimeFunction(setting);
        // console.log(topUpAllowed)

        let msg;
        let finalBalance;
        let balance = Number(amount);

        // deposite as froze_amount on specific stage
        // check journey product

        let pendingObject;
        if (user?.journeyHistory !== null) {
            const checkJourneyProduct = await JourneyHistory.findById(user?.journeyHistory);
            const collectAllHistory = checkJourneyProduct?.JourneyHistory;

            const findPending = collectAllHistory?.filter((product) => product.status === "pending");
            pendingObject = findPending[0]
        }

        let frozeAmount;
        let calFrozeAmount;
        if (pendingObject?.isJourneyProduct) {
            calFrozeAmount = user?.froze_amount + balance;
            frozeAmount = calFrozeAmount?.toFixed(2);
        } else {
            calFrozeAmount = user?.froze_amount;
            frozeAmount = calFrozeAmount?.toFixed(2);
        }

        if (type === "credit") {
            msg = `"${amount}" has been created to "${user?.username}" successfully`;
            finalBalance = user?.balance + balance;
        } else {
            msg = `"${amount}" has been debited from "${user?.username}" successfully`;
            finalBalance = user?.balance - balance;
        }

        if (type == "debit") {
            const withdrawals = await Withdrawal.findById(user?.withdrawal);
            const allWithdrawals = withdrawals?.wallet || [];

            const currentTime = new Date();
            const uniqueId = `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            if (user?.withdrawal === null) {
                const walletData = {
                    id: user?._id,
                    iid: uniqueId,
                    username: user?.username,
                    phone_number: user?.phone_number,
                    wallet_name: user?.wallet_name ?? user?.username,
                    wallet_address: user?.wallet_address ?? "NULL",
                    network_type: user?.network_type ?? "NULL",
                    currency: user?.currency ?? "NULL",
                    withdrawal_amount: Number(amount),
                    status: "approved",
                    remark: remark,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                };

                const withdrawal = await Withdrawal.create({
                    wallet: [walletData]
                });

                await User.findByIdAndUpdate(user?._id, {
                    withdrawal: withdrawal._id,
                });

            } else {
                const newObj = {
                    id: user?._id,
                    iid: uniqueId,
                    username: user?.username,
                    phone_number: user?.phone_number,
                    wallet_name: user?.wallet_name ?? user?.username,
                    wallet_address: user?.wallet_address ?? "NULL",
                    network_type: user?.network_type ?? "NULL",
                    currency: user?.currency ?? "NULL",
                    withdrawal_amount: Number(amount),
                    status: "approved",
                    remark: remark,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                }

                const updateArray = [...allWithdrawals, newObj];

                await Withdrawal.findByIdAndUpdate(user?.withdrawal, {
                    wallet: updateArray
                });
            }
        }

        await AccountChange.create({
            username: user?.username,
            phone_number: user?.phone_number,
            amount: amount,
            after_operation: finalBalance,
            account_type: type
        });

        if (type === "credit") {
            await User.findByIdAndUpdate(_id, {
                balance: finalBalance?.toFixed(2),
                froze_amount: frozeAmount,
            });
        } else {
            await User.findByIdAndUpdate(_id, {
                balance: finalBalance?.toFixed(2),
                froze_amount: frozeAmount
            });
        }

        await Recharge.create({
            username: user?.username,
            recharge_by: sessionUser?.username,
            amount: amount,
            recharge_type: type,
            after_recharge: finalBalance?.toFixed(2),
            remark: remark,
        });

        return {
            message: msg,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const resetUser = async (id) => {

    try {
        await connectToDB();

        const { user: loggedInUser } = await auth();

        if (!id) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const authenticatedUser = await User.findById(id);

        await User.findByIdAndUpdate(id, {
            today_order: 0,
            today_commission: 0,
            froze_amount: 0,
            journey: null,
            ticket_commission: 0,
            ticket_point: 0
        });

        await Action.create({
            operationBy: loggedInUser?.username ?? "",
            username: authenticatedUser?.username ?? "",
            phone_number: authenticatedUser?.phone_number ?? "",
            beforeOperation: "Reset",
            afterOperation: "Reset",
            chnageType: "reset" ?? "",
        });

        return {
            message: `Reset successfully!`,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const createWallet = async (formData) => {
    const { wallet_name, wallet_address, wallet_phone, network_type, currency, id } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const { user: loggedInUser } = await auth();
        const authenticatedUser = await User.findById(id);

        if (!authenticatedUser) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const updateFields = {
            wallet_name,
            wallet_address,
            network_type,
            currency,
            wallet_phone
        }

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        const isUpdated = await User.findByIdAndUpdate(authenticatedUser?._id, updateFields);

        if (authenticatedUser?.role !== "agent" && authenticatedUser?.role !== "user" && authenticatedUser?.role !== "practice") {
            if (isUpdated) {
                const data = await User.updateMany(
                    {
                        connected_agent_id: authenticatedUser?.id,
                        role: "practice"
                    },
                    {
                        $set: {
                            wallet_name,
                            wallet_address,
                            network_type,
                            currency,
                            wallet_phone
                        }
                    });
            }
        }

        if (authenticatedUser?.withdrawal !== null) {
            const withdrawal = await Withdrawal.findById(authenticatedUser?.withdrawal);
            const withdrawals = withdrawal?.wallet;

            const allPendingWithdrawal = withdrawals
                ?.filter((item) => item.status === "pending")
                .map((item) => item.toObject());

            const allOtherWithdrawal = withdrawals
                ?.filter((item) => item.status !== "pending")
                .map((item) => item.toObject());

            const neededArray = [];
            allPendingWithdrawal?.forEach(item => {
                const updatedItem = {
                    ...item,
                    wallet_name: wallet_name,
                    wallet_address,
                    network_type,
                    currency,
                    // phone_number: wallet_phone
                };

                neededArray.push(updatedItem);
            });

            const finalWithdrawals = [...allOtherWithdrawal, ...neededArray];

            await Withdrawal.findByIdAndUpdate(authenticatedUser?.withdrawal, {
                wallet: finalWithdrawals
            });

        }

        // activity
        if (authenticatedUser?.wallet_name !== wallet_name) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: authenticatedUser?.username ?? "",
                phone_number: authenticatedUser?.phone_number ?? "",
                beforeOperation: authenticatedUser?.wallet_name ?? "",
                afterOperation: wallet_name ?? "",
                chnageType: "walletName" ?? "",
            });
        }

        if (authenticatedUser?.wallet_address !== wallet_address) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: authenticatedUser?.username ?? "",
                phone_number: authenticatedUser?.phone_number ?? "",
                beforeOperation: authenticatedUser?.wallet_address ?? "",
                afterOperation: wallet_address ?? "",
                chnageType: "walletAddress" ?? "",
            });
        }

        if (authenticatedUser?.wallet_phone !== wallet_phone) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: authenticatedUser?.username ?? "",
                phone_number: authenticatedUser?.phone_number ?? "",
                beforeOperation: authenticatedUser?.wallet_phone ?? "",
                afterOperation: wallet_phone ?? "",
                chnageType: "walletPhone" ?? "",
            });
        }

        if (authenticatedUser?.network_type !== network_type) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: authenticatedUser?.username ?? "",
                phone_number: authenticatedUser?.phone_number ?? "",
                beforeOperation: authenticatedUser?.network_type ?? "",
                afterOperation: network_type ?? "",
                chnageType: "walletNetwork" ?? "",
            });
        }

        if (authenticatedUser?.currency !== currency) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: authenticatedUser?.username ?? "",
                phone_number: authenticatedUser?.phone_number ?? "",
                beforeOperation: authenticatedUser?.currency ?? "",
                afterOperation: currency ?? "",
                chnageType: "walletCurrency" ?? "",
            });
        }

        return {
            message: "Wallet information saved successfully",
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const blockUser = async (formData) => {
    const { id, status } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const { user: loggedInUser } = await auth();

        const authenticatedUser = await User.findById(id);

        if (!authenticatedUser) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const currentUser = authenticatedUser;

        const newSecurityCode = await generateSecurityCode();

        await User.findByIdAndUpdate(authenticatedUser?._id, {
            status,
            security_code: newSecurityCode
        });

        let message;
        if (status === "true") {
            message = `User unblock blocked successfully`
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: "Block",
                afterOperation: "Unblock",
                chnageType: "account_status",
            });

        } else {
            message = `User blocked successfully`

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: "Unblock",
                afterOperation: "Block",
                chnageType: "account_status",
            });
        }


        return {
            message: message,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const changePassword = async (formData) => {
    const {
        id,
        password,
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        if (!id) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const authenticatedUser = await User.findById(id);

        if (!authenticatedUser) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const newSecurityCode = await generateSecurityCode();
        const hasedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(id, {
            password: hasedPassword,
            security_code: newSecurityCode
        })

        return {
            message: `Your password has been changed!`,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const changeLang = async (formData) => {

    const {
        id,
        val
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        if (!id) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        await User.findByIdAndUpdate(id, {
            language: val
        });

        return {
            message: `Language changed successfully!`,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}

export const fetchDataWithID = async (formData) => {
    const { id } = Object.fromEntries(formData);

    const users = await User.findById(id);

    const newData = JSON.parse(JSON.stringify(users))

    if (!newData) return {
        message: `User not found!`,
        status: 404,
        type: "danger"
    };

    return {
        data: newData,
        message: `fetched`,
        status: 201,
        type: "success"
    };
}