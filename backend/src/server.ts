// import * as dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory

// dotenv.config({ path: path.resolve(__dirname, '../') + '/.env.local' });

import express, { Express, Request, Response } from "express";
import { STOCKS_TO_POLL } from "./lib/constants";
import clientPromise from "./lib/mongodb";
import initializePolling from "./lib/pollStockData";
import { Server } from "socket.io";
import { createServer } from "http";

const app: Express = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

const socketIntervals = new Map<string, NodeJS.Timeout>();

const DB_NAME = process.env.MONGODB_DB_NAME || "stock-tracker"
const COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || "stocks"


app.get("/api/stocks", async (req: Request, res: Response) => {
    res.json({ stocksToPoll: STOCKS_TO_POLL });
})

app.get("/api/stock/chart/:symbol", async (req: Request, res: Response) => {
    const symbol = req.params.symbol as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const data = await collection
            .find({ symbol })
            .sort({ timestamp: -1 }) // Sort in descending order (latest first)
            .limit(limit)
            .toArray();

        return res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
    socket.on('pollSymbol', (update: { symbol: string, stop: boolean }) => {
        const existingIntervalId = socketIntervals.get(socket.id);
        if (update.stop && existingIntervalId) {
            console.log(`[server]: Stopping emitting for socket ${socket.id} : ${existingIntervalId}`);
            clearInterval(existingIntervalId);
        }
        if (update.symbol) {
            const intervalId = setInterval(() => {
                clientPromise.then(async (client) => {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(COLLECTION_NAME);
                    const data = await collection
                        .find({ symbol: update.symbol })
                        .sort({ timestamp: -1 }) // Sort in descending order (latest first)
                        .limit(20)
                        .toArray();

                    // Sanitize the data to remove circular references
                    const sanitizedData = data.map(item => ({
                        ...item,
                        _id: item._id.toString(), // Convert ObjectId to string, threw an error without this
                    }));
                    console.log(`[server]: Emitting data for ${update.symbol} for socket ${socket.id}`);
                    socket.emit('pollData', { symbol: update.symbol, data: sanitizedData });
                })
            }, 500); // Poll every 0.5 seconds
            console.log(`[server]: Starting polling ${update.symbol} : ${intervalId} ; for socket ${socket.id}`);
            socketIntervals.set(socket.id, intervalId);
        } else {
            console.log(`[server]: No symbol provided for socket ${socket.id}`);
        }
    });
})

server.listen(port, async () => {
    console.log(`[server]: Server is running in ${process.env.NODE_ENV} mode at http://localhost:${port}`);
    console.log('[server]: Initializing polling...');
    const client = await clientPromise;
    initializePolling(client);


});