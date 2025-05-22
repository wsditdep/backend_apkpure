"use server";

import { Product } from "@/modals/Product";
import { connectToDB } from "@/utils/connection";

export const fetchProducts = async (q, page, sortByPrice, limit) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = limit || 10;

    try {
        await connectToDB();

        const count = await Product.find().count();

        if (sortByPrice === "") {
            sortByPrice = "asc"
        }

        const sortOption = sortByPrice === "asc" ? { productPrice: 1 } : sortByPrice === "desc" ? { productPrice: -1 } : { createdAt: -1 };

        const products = await Product.find({ productName: { $regex: regex } },)
            .sort(sortOption)
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));

        if (!products) {
            return { products: [], count: 0 };
        }

        return { products, count };
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllProducts = async (page, limit, minPrice, maxPrice) => {

    const ITEM_PER_PAGE = limit || 10;

    try {
        await connectToDB();

        const priceFilter = {};
        if (minPrice) {
            priceFilter.productPrice = { $gte: minPrice };
        }

        if (maxPrice) {
            priceFilter.productPrice = {
                ...priceFilter.productPrice,
                $lte: maxPrice,
            };
        }

        const count = await Product.find(priceFilter).count()

        const products = await Product.find(priceFilter)
            .sort({ productPrice: 1 })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));;

        const returnData = {
            count,
            products,
            status: 201
        };
        return JSON.stringify(returnData);
    } catch (error) {
        console.log(error)
    }
}