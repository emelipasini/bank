import { Collection, MongoClient } from "mongodb";
import config from "config";

import { Account, Movement, MovementType } from "../domain/models";

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

    static async addMany(accounts: Account[]) {
        try {
            return await accountsCollection.insertMany(accounts);
        } catch (e) {
            console.error(`Error occurred while finding account, ${e}`);
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

    static async deposit(cbu: string, amount: number) {
        try {
            const movement = new Movement(cbu, amount, MovementType.Deposit);

            return await accountsCollection.updateOne(
                { cbu },
                { $inc: { money: amount }, $push: { movements: movement } }
            );
        } catch (e) {
            console.error(`Error occurred while finding account, ${e}`);
            return { error: e };
        }
    }
}
