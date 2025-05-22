"use server";

import { Content } from "@/modals/Content";
import { Notice } from "@/modals/Notice";
import { connectToDB } from "@/utils/connection";

export const createAnnouncement = async (formData) => {

    const { title, description } = Object.fromEntries(formData);

    try {
        await connectToDB();

        await Notice.create({
            notice_name: title,
            notice: description
        });

        return {
            message: "Announcement created successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const updateAnnouncement = async (formData) => {

    const { id, title, description } = Object.fromEntries(formData);

    if(!id) {
        return {
            message: "Not Found",
            status: 404,
            type: "danger",
        };
    }

    try {
        await connectToDB();

        const updateFields = {
            id,
            notice_name: title,
            notice: description
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Notice.findByIdAndUpdate(id, updateFields);

        return {
            message: "Announcement updated successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const deleteAnnouncement = async (id) => {

    try {
        await connectToDB();

        if (!id) return {
            message: "User not found!",
            status: 404,
            type: "danger",
        };

        await Notice.findByIdAndDelete(id);

        return {
            message: "Announcement deleted successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const createContent = async (formData) => {

    const { title, description } = Object.fromEntries(formData);

    try {
        await connectToDB();

        await Content.create({
            title: title,
            description: description
        });

        return {
            message: "Content created successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const updateContent = async (formData) => {

    const { id, title, description } = Object.fromEntries(formData);

    if(!id) {
        return {
            message: "Not Found",
            status: 404,
            type: "danger",
        };
    }

    try {
        await connectToDB();

        const updateFields = {
            title: title,
            description: description
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Content.findByIdAndUpdate(id, updateFields);

        return {
            message: "Content updated successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}

export const deleteContent = async (id) => {

    if(!id) {
        return {
            message: "Not Found",
            status: 404,
            type: "danger",
        };
    }

    try {
        await connectToDB();

        if (!id) return {
            message: "User not found!",
            status: 404,
            type: "danger",
        };

        await Content.findByIdAndDelete(id);

        return {
            message: "Content deleted successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}
