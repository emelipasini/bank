import config from "config";
import supertest from "supertest";

import { Collection } from "mongodb";
import { UserDB } from "../../src/database/user";

import { app, client, server } from "../../app";
import { User } from "../../src/models/user";
import { createUser } from "../utils/users";

const api = supertest(app);

let usersCollection: Collection;
let oldUser: User;

describe("Register", () => {
    beforeAll(async () => {
        usersCollection = client.db(config.get("DB_NAME")).collection("users");

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

        const result = await api.post("/api/users/").send(newUser);
        expect(result.statusCode).toBe(201);
        expect(result.body).toBe("User created succesfully");
    });
});
