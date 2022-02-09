import config from "config";
import supertest from "supertest";

import { Collection, ObjectId } from "mongodb";
import { AccountDB } from "../../src/database/account";
import { UserDB } from "../../src/database/user";

import { app, client, server } from "../../app";
import { Account, User } from "../../src/domain/models";

import { createAccount, createUSDAccount } from "../utils/accounts";
import { createUser, generateToken } from "../utils/users";

const api = supertest(app);

let accountsCollection: Collection;
let usersCollection: Collection;

let user: User;
let token: string;

let account: Account;
let otherAccount: Account;
let usdAccount: Account;

describe("Deposit money in account", () => {
    beforeAll(async () => {
        accountsCollection = client.db(config.get("DB_NAME")).collection("accounts");
        usersCollection = client.db(config.get("DB_NAME")).collection("users");

        await AccountDB.injectDB(client);
        await UserDB.injectDB(client);

        user = createUser();
        await UserDB.addUser(user);

        token = generateToken(user);

        account = createAccount(user._id!);
        otherAccount = createAccount(new ObjectId());
        usdAccount = createUSDAccount(user._id!);

        await AccountDB.addMany([account, otherAccount, usdAccount]);
    });

    afterAll(async () => {
        await accountsCollection.drop();
        await usersCollection.drop();

        await client.close();
        server.close();
    });

    it("should deposit the money in the account", async () => {
        const deposit = {
            cbu: account.cbu,
            amount: 10000,
        };
        const result = await api
            .post("/api/accounts/deposit")
            .query(deposit)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(200);
        expect(result.body.meta.message).toBe("Money successfully deposited");

        const amount = (await AccountDB.findAccount(account.cbu)) as Account;
        expect(amount.money).toBe(deposit.amount);
    });

    it("should not deposit the money if token is missing", async () => {
        const deposit = {
            cbu: account.cbu,
            amount: 10000,
        };
        const result = await api.post("/api/accounts/deposit").query(deposit);

        expect(result.statusCode).toBe(401);
        expect(result.body.meta.message).toBe("Unauthorized");
    });

    it("should not deposit if it's not the owner of the account", async () => {
        const deposit = {
            cbu: otherAccount.cbu,
            amount: 10000,
        };
        const result = await api
            .post("/api/accounts/deposit")
            .query(deposit)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("You can only deposit to your own account");
    });

    it("should not deposit if it's a dollar account", async () => {
        const deposit = {
            cbu: usdAccount.cbu,
            amount: 10000,
        };
        const result = await api
            .post("/api/accounts/deposit")
            .query(deposit)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("You cannot deposit in a dollar account");
    });
});
