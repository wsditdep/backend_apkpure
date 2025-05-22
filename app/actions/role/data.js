import { auth } from "@/app/auth";
import { Role } from "@/modals/Role";
import { connectToDB } from "@/utils/connection";

export const fetchRoles = async () => {
    try {
        await connectToDB();

        const roles = await Role.find();

        return roles;
    } catch (error) {
        console.log(error);
    }
}

export const fetchMenuUserPermission = async () => {
    try {
        await connectToDB();

        const { user } = await auth();

        if (!user || !user.role) {
            return { permission: {}, subPermission: {} };
        }

        const permissions = await Role.find({ role_name: user?.role });

        if (permissions.length === 0) {
            return { permission: {}, subPermission: {} };
        }

        const permission = permissions[0]?.menu_permission;
        const subPermission = permissions[0]?.sub_menu_permission;

        return { permission, subPermission };
    } catch (error) {
        console.log(error);
    }

}