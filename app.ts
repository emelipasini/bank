import express from "express";
import http from "http";
import { MongoClient } from "mongodb";
import config from "config";
import { Request, Response } from "express";

export const app = express();
export const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
	res.send("Hola!");
});

export const client = new MongoClient(config.get("DB_URI"));

client.connect()
	.then(async (client: MongoClient) => {
		console.log("Database connected");
		
		server.listen("4200", () => {
			console.log("SERVER RUNNING IN PORT 4200...");
		});
	})
	.catch((err: Error) => {
		console.error(err.stack);
	});
