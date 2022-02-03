import { Collection, MongoClient } from "mongodb";
import config from "config";

import { Account } from "../domain/models/account";

let accountsCollection: Collection;

export class AccountDB {
    static async injectDB(client: MongoClient) {
        if (accountsCollection) {
            return;
        }
        try {
            accountsCollection = client.db(config.get("DB_NAME")).collection("accounts");
        } catch (error) {
            `Unable to establish collection handles in accounts database: ${error}`;
        }
    }

    static async addAccount(account: Account) {
        try {
            await accountsCollection.insertOne(account);
        } catch (e) {
            console.error(`Error occurred while adding account, ${e}`);
            return { error: e };
        }
    }

    static async findAccount(cbu: string) {
        try {
            return await accountsCollection.findOne({ cbu });
        } catch (e) {
            console.error(`Error occurred while finding account, ${e}`);
            return { error: e };
        }
    }
}
