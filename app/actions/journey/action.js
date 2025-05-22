"use server";

import { auth } from "@/app/auth";
import { Action } from "@/modals/Action";
import { Journey } from "@/modals/Journey";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";

export const createJourney = async (formData) => {
    try {
        await connectToDB();

        const {
            userId,
            journeyProduct,
            ticket_point
        } = Object.fromEntries(formData);

        const journeyProducts = JSON.parse(journeyProduct);
        const journeyProductsString = JSON.stringify(journeyProduct);

        const { user: loggedInUser } = await auth();
        const user = await User.findById(userId);

        if (!user) return {
            message: "User not found!",
            status: 404,
            type: "danger",
        };

        const currentUser = user;

        if (user?.journey === null) {
            const newJourney = new Journey({
                journey: journeyProducts
            })
            await newJourney.save();

            await User.findByIdAndUpdate(userId, {
                journey: newJourney._id,
                ticket_point
            });

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: "" ?? "",
                afterOperation: journeyProductsString ?? "",
                chnageType: "journey" ?? "",
            });

        } else {
            const oldJouney = await Journey.findByIdAndUpdate(user.journey, {
                journey: journeyProducts
            });

            const oldJourneyData = oldJouney?.journey;
            const oldJourneyDataString = JSON.stringify(oldJourneyData)

            await User.findByIdAndUpdate(userId, {
                ticket_point
            });

            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: oldJourneyDataString ?? "",
                afterOperation: journeyProductsString ?? "",
                chnageType: "journey" ?? "",
            });
        }

        return {
            message: "Jouney has been set",
            status: 201,
            type: "success",
        };
    } catch (error) {
        console.log(error)
    }
}

export const resetJourney = async (id) => {
    try {
        await connectToDB();

        const user = await User.findById(id);

        if (!user) return {
            message: `User not found!`,
            status: 404,
            type: "danger"
        };

        const currentUser = user;
        const { user: loggedInUser } = await auth();

        const oldJouney = await Journey.findById(user?.journey);

        const oldJourneyData = oldJouney?.journey;
        const oldJourneyDataString = JSON.stringify(oldJourneyData);

        const isOK = await User.findByIdAndUpdate(id, {
            journey: null
        });

        if (isOK) {
            await Action.create({
                operationBy: loggedInUser?.username ?? "",
                username: currentUser?.username ?? "",
                phone_number: currentUser?.phone_number ?? "",
                beforeOperation: oldJourneyDataString ?? "",
                afterOperation: "" ?? "",
                chnageType: "journey" ?? "",
            });
        }

        return {
            message: `Reset successfully!`,
            status: 201,
            type: "success"
        };

    } catch (error) {
        console.log(error)
    }
}