"use server";

import { Content } from "@/modals/Content";
import { Notice } from "@/modals/Notice";
import { connectToDB } from "@/utils/connection";

export const fetchNotice = async () => {
    try {
        await connectToDB();
        const notice = await Notice.find();

        return notice;
    } catch (error) {
        console.log(error);
    }
}

export const fetchContent = async () => {
    try {
        await connectToDB();
        const content = await Content.find();

        return content;
    } catch (error) {
        console.log(error);
    }
}