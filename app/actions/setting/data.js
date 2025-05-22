"use server";

import { Pop } from "@/modals/Pop";
import { Setting } from "@/modals/Setting";
import { Support } from "@/modals/Support";
import { connectToDB } from "@/utils/connection";

export const fetchSetting = async () => {
    try {
        await connectToDB();

        const setting = await Setting.findOne();
        return setting;

    } catch (error) {
        console.log(error);
    }
}

export const fetchSupport = async () => {
    try {
        await connectToDB();

        const support = await Support.find();

        return support;

    } catch (error) {
        console.log(error);
    }
}

export const fetchPop = async () => {
    try {
        await connectToDB();

        const pop = await Pop.findOne();

        return pop;

    } catch (error) {
        console.log(error);
    }
}