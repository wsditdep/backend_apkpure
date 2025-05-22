import mongoose from "mongoose";

const connection = {};

export const connectToDB = async () => {
    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DATABASE_NAME // Specify your database name here
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database!");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
