import mongoose from "mongoose";

const schema = new mongoose.Schema({
    operationBy: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    beforeOperation: {
        type: String,
        required: false,
    },
    afterOperation: {
        type: String,
        required: false,
    },
    chnageType: {
        type: String,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};

export const Action = mongoose.model("Action", schema);