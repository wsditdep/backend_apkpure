"use server";

import { Product } from "@/modals/Product";
import { connectToDB } from "@/utils/connection";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createProduct = async (formData) => {
    let {
        productName,
        productPrice,
        storeName,
        productContent,
        public_id,
        url
    } = Object.fromEntries(formData);

    try {
        await connectToDB();
        await Product.create({
            productName,
            productPrice,
            storeName,
            productContent,
            public_id,
            url,
        });

        return {
            message: "Poduct added successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (id) => {
    try {
        await connectToDB();

        if (!id) return {
            message: "Poduct not found",
            status: 201,
            type: "success"
        };

        const isProduct = await Product.findOne({ _id: id });
        if (!isProduct) return {
            message: "Poduct not found",
            status: 201,
            type: "success"
        };

        // await cloudinary.v2.uploader.destroy(isProduct?.public_id);
        await Product.findByIdAndDelete(id);

        return {
            message: "Poduct deleted successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (formData) => {

    const { id, productName, productPrice, storeName, productContent, public_id, url } = Object.fromEntries(formData);

    if (!id) {
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
            productName,
            productPrice,
            storeName,
            productContent,
            public_id,
            url
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
        );

        await Product.findByIdAndUpdate(id, updateFields);

        return {
            message: "Product updated successfully!",
            status: 201,
            type: "success",
        };

    } catch (error) {
        console.log(error)
    }
}