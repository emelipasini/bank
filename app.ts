import express from "express";
import http from "http";
import config from "config";

import { MongoClient } from "mongodb";
import { Request, Response } from "express";
import { UserDB } from "./src/database/user";

export const app = express();
export const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
    res.send("Hola Mundo!");
});

export const client = new MongoClient(config.get("DB_URI"));

client
    .connect()
    .then(async (client: MongoClient) => {
        console.log("Database connected");
        await UserDB.injectDB(client);

        server.listen("4200", () => {
            console.log("SERVER RUNNING IN PORT 4200...");
        });
    })
    .catch((err: Error) => {
        console.error(err.stack);
    });
