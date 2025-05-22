import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        default: ""
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productContent: {
        type: String,
        default: ""
    },
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};


export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);