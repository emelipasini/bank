import { Collection, MongoClient } from "mongodb";
import config from "config";

import { User } from "../models/user";

let usersCollection: Collection;

export class UserDB {
    static async injectDB(client: MongoClient) {
        if (usersCollection) {
            return;
        }
        try {
            usersCollection = client.db(config.get("DB_NAME")).collection("users");
        } catch (error) {
            `Unable to establish collection handles in users database: ${error}`;
        }
    }

    static async addUser(user: User) {
        try {
            await usersCollection.insertOne(user);
        } catch (e) {
            console.error(`Error occurred while adding user, ${e}`);
            return { error: e };
        }
    }
}
