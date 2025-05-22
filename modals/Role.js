import mongoose from "mongoose";

const schema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },
    menu_permission: {},
    sub_menu_permission: {},
}, { timestamps: true });

mongoose.models = {};

export const Role = mongoose.model("Role", schema);