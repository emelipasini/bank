import config from "config";
import supertest from "supertest";

import { Collection } from "mongodb";
import { UserDB } from "../../src/database/user";

import { app, client, server } from "../../app";
import { User } from "../../src/domain/models/user";
import { createBadPassword, createBadUser, createUser } from "../utils/users";

const api = supertest(app);

let usersCollection: Collection;
let oldUser: User;

describe("Register", () => {
    beforeAll(async () => {
        usersCollection = client.db(config.get("DB_NAME")).collection("users");
        await UserDB.injectDB(client);

        oldUser = createUser();
        await UserDB.addUser(oldUser);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await client.close();

        server.close();
    });

    it("should save the new user", async () => {
        const newUser = createUser();

        const result = await api.post("/api/users/register").query(newUser);
        expect(result.statusCode).toBe(201);
        expect(result.body.data.firstname).toBe(newUser.firstname);

        const userSaved = usersCollection.findOne({ email: newUser.email });
        expect(userSaved).toBeDefined();
    });

    it("should NOT save the user if the email already exists in database", async () => {
        const result = await api.post("/api/users/register").query(oldUser);

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("The email already exists in the database");
    });

    it("should NOT save the user if the password isnt secure", async () => {
        const badUser = createUser();
        badUser.password = createBadPassword();

        const result = await api.post("/api/users/register").query(badUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.data.errors[0].msg).toBe("The password is not secure");
    });

    it("should NOT save the user if a field is empty", async () => {
        const badUser = createBadUser();

        const result = await api.post("/api/users/register").query(badUser);
        expect(result.statusCode).toBe(400);
    });
});
