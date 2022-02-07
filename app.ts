import express from "express";
import http from "http";
import config from "config";

import { MongoClient } from "mongodb";
import { UserDB } from "./src/database/user";
import { AccountDB } from "./src/database/account";

import usersRouter from "./src/api/users";

export const app = express();
export const server = http.createServer(app);

app.use("/api/users", usersRouter);

export const client = new MongoClient(config.get("DB_URI"));

client
    .connect()
    .then(async (client: MongoClient) => {
        console.log("Database connected");
        await UserDB.injectDB(client);
        await AccountDB.injectDB(client);

        server.listen("4200", () => {
            console.log("SERVER RUNNING IN PORT 4200...");
        });
    })
    .catch((err: Error) => {
        console.error(err.stack);
    });
