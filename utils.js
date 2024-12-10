import { Server } from "socket.io";
import { createAdapter } from "@socket.io/mongo-adapter";
import mongoose from 'mongoose';
import { MongoClient } from "mongodb";

export function setupDB() {
    // MongoDB Setup
    console.log("Connecting to MongoDB");

    mongoose.connect(process.env['MY_MONGODB_DATABASE_URL']);

    const messageSchema = new mongoose.Schema(
        {
            id: {
                type: Number,
                unique: true,
                required: true,
            },
            content: String,
            clientOffset: {
                type: String,
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    );

    const Message = mongoose.model('Message', messageSchema);

    return Message;
}

const getDatabaseName = (url) => {
    try {
        const parsedUrl = new URL(url);
        const pathname = parsedUrl.pathname;
        // The database name is typically after the "/" in the pathname
        return pathname ? pathname.split('/')[1] : null;
    } catch (error) {
        console.error('Invalid MongoDB connection URL:', error.message);
        return null;
    }
};

// This function creates a new MongoDB collection for the Socket.IO adapter to use.
//
// Read more info here:
// https://genezio.com/docs/integrations/upstash-redis/
// https://socket.io/docs/v4/mongo-adapter/
export async function getScalingAdapter() {
    const DB = getDatabaseName(process.env['MY_MONGODB_DATABASE_URL']);
    const COLLECTION = "socket.io-adapter-events";

    const mongoClient = new MongoClient(process.env['MY_MONGODB_DATABASE_URL']);

    await mongoClient.connect();

    try {
        await mongoClient.db(DB).createCollection(COLLECTION);
    } catch (e) {
        console.error(e);
    }
    const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

    return createAdapter(mongoCollection);
}
