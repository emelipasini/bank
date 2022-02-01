import config from "config";
import supertest from "supertest";
import bcrypt from "bcrypt";

import { Collection } from "mongodb";
import { UserDB } from "../../src/database/user";

import { app, client, server } from "../../app";
import { User } from "../../src/domain/models/user";
import { createPassword, createUser } from "../utils/users";

const api = supertest(app);

let usersCollection: Collection;
let user: User;

describe("Login", () => {
    beforeAll(async () => {
        usersCollection = client.db(config.get("DB_NAME")).collection("users");
        await UserDB.injectDB(client);

        user = createUser();
        const password = user.password;
        user.password = await bcrypt.hash(user.password, 10);
        await UserDB.addUser(user);
        user.password = password;
    });

    afterAll(async () => {
        await usersCollection.drop();
        await client.close();

        server.close();
    });

    it("should login user", async () => {
        const result = await api.post("/api/users/login").query({
            email: user.email,
            password: user.password,
        });

        expect(result.statusCode).toBe(200);
        expect(result.body.meta.message).toBe("User logged in");
        expect(result.body.data.token).toBeDefined();
    });

    it("should NOT login user if the email doesn't exist", async () => {
        const fakeUser = createUser();
        const result = await api.post("/api/users/login").query({
            email: fakeUser.email,
            password: fakeUser.password,
        });

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("Invalid credentials");
    });

    it("should NOT login user if the password is wrong", async () => {
        const fakePassword = createPassword();
        const result = await api.post("/api/users/login").query({
            email: user.email,
            password: fakePassword,
        });

        expect(result.statusCode).toBe(400);
        expect(result.body.meta.message).toBe("Invalid credentials");
    });
});
