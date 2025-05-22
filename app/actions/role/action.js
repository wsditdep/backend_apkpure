"use server";

import { Role } from "@/modals/Role";
import { connectToDB } from "@/utils/connection";

export const createRole = async (formData) => {
    let {
        role_name,
        menu_permission,
        menu_sub_permission
    } = Object.fromEntries(formData);

    const newMenuPermission = JSON.parse(menu_permission);
    const newSubMenuPermission = JSON.parse(menu_sub_permission);

    try {
        await connectToDB();

        const isRole = await Role.findOne({ role_name: role_name });

        if (isRole) return {
            message: "Role already exist. Try different role name!",
            status: 404,
            type: "danger"
        };

        await Role.create({
            role_name,
            menu_permission: newMenuPermission,
            sub_menu_permission: newSubMenuPermission
        })

        return {
            message: "Role added successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}

export const updateRole = async (formData) => {
    let {
        id,
        role_name,
        menu_permission,
        menu_sub_permission
    } = Object.fromEntries(formData);

    try {
        await connectToDB();

        if (!id) return {
            message: "Role not found!",
            status: 404,
            type: "danger"
        };

        const newMenuPermission = JSON.parse(menu_permission);
        const newSubMenuPermission = JSON.parse(menu_sub_permission);

        console.log(newMenuPermission)
        console.log(newSubMenuPermission)

        const updateFields = {
            role_name,
            menu_permission: newMenuPermission,
            sub_menu_permission: newSubMenuPermission
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Role.findByIdAndUpdate(id, updateFields)

        return {
            message: "Role updated successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}

export const deleteRole = async (id) => {
    try {
        await connectToDB();

        if (!id) return {
            message: "Poduct not found",
            status: 201,
            type: "success"
        };

        const isRole = await Role.findOne({ _id: id });
        if (!isRole) return {
            message: "Role not found",
            status: 201,
            type: "success"
        };

        await Role.findByIdAndDelete(isRole?._id);

        return {
            message: "Role deleted successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}   