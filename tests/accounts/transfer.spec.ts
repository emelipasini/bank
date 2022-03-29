import config from "config";
import supertest from "supertest";

import { Collection, ObjectId } from "mongodb";
import { AccountDB } from "../../src/database/account";
import { UserDB } from "../../src/database/user";

import { app, client, server } from "../../app";
import { Account, User } from "../../src/domain/models";

import { createAccount } from "../utils/accounts";
import { createUser, generateToken } from "../utils/users";

const api = supertest(app);

let accountsCollection: Collection;
let usersCollection: Collection;

let moneyUser: User;
let zeroUser: User;

let moneyToken: string;
let zeroToken: string;

let moneyAccount: Account;
let zeroAccount: Account;
let transferAccount: Account;

describe("Tranfer money to someone", () => {
    beforeAll(async () => {
        accountsCollection = client.db(config.get("DB_NAME")).collection("accounts");
        usersCollection = client.db(config.get("DB_NAME")).collection("users");

        await AccountDB.injectDB(client);
        await UserDB.injectDB(client);

        moneyUser = createUser();
        zeroUser = createUser();

        await UserDB.addMany([moneyUser, zeroUser]);

        moneyToken = generateToken(moneyUser);
        zeroToken = generateToken(zeroUser);

        moneyAccount = createAccount(moneyUser._id!);
        moneyAccount.money = 50000;

        zeroAccount = createAccount(zeroUser._id!);
        transferAccount = createAccount(new ObjectId());

        await AccountDB.addMany([moneyAccount, zeroAccount, transferAccount]);
    });

    afterAll(async () => {
        await accountsCollection.drop();
        await usersCollection.drop();

        await client.close();
        server.close();
    });

    it("should transfer the money", async () => {
        const deposit = {
            from: moneyAccount.cbu,
            to: transferAccount.cbu,
            amount: 10000,
        };
        const result = await api
            .post("/api/accounts/transfer")
            .query(deposit)
            .set("Authorization", "Bearer " + moneyToken);

        expect(result.statusCode).toBe(200);
        expect(result.body.meta.message).toBe("Successful transfer");

        const updatedAccountFrom = (await AccountDB.findAccount(transferAccount.cbu)) as Account;
        expect(updatedAccountFrom.money).toBe(moneyAccount.money - deposit.amount);

        const updatedAccountTo = (await AccountDB.findAccount(transferAccount.cbu)) as Account;
        expect(updatedAccountTo.money).toBe(deposit.amount);
    });

    it("should NOT transfer if there isn't enough money", async () => {
        const deposit = {
            from: zeroAccount.cbu,
            to: transferAccount.cbu,
            amount: 10000,
        };
        const result = await api
            .post("/api/accounts/transfer")
            .query(deposit)
            .set("Authorization", "Bearer " + zeroToken);

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("You don't have enough money");
    });
});
