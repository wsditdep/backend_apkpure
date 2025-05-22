"use server";

import { Journey } from "@/modals/Journey";
import { User } from "@/modals/User";
import { connectToDB } from "@/utils/connection";

export const fetchUserInfo = async (id) => {
    try {
        await connectToDB();

        if (!id) return {
            message: `Something went wrong!`,
            status: 404,
            type: "danger"
        };

        const user = await User.findById(id);

        if (!user) return {};

        return user;
    } catch (error) {
        console.log(error);
    }
}

export const fetchUserJourney = async (id) => {
    
    try {
        await connectToDB();
        
        if (!id) return {
            message: `Something went wrong!`,
            status: 404,
            type: "danger"
        };

        const user = await User.findById(id);
        const journey = await Journey.findById(user.journey);

        if (!journey) return [];

        return journey;
    } catch (error) {
        console.log(error);
    }
}