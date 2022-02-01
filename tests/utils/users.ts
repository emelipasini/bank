import { faker } from "@faker-js/faker";

import { User } from "../../src/domain/models";
import { randomNumber } from "./functions";

export function createUser() {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email();
    const password = createPassword();

    const user = new User(firstname, lastname, email, password);
    return user;
}

export function createBadUser() {
    const opts = ["firstname", "lastname", "email", "password"];
    const user = createUser();

    const random = randomNumber(4);
    const randomField = opts[random];

    delete (user as any)[randomField];
    return user;
}

export function createPassword(): string {
    return faker.random.alphaNumeric(8);
}

export function createBadPassword() {
    const opts = ["abcd", "1234", "abc123", "password, 12345678", ""];
    const random = randomNumber(6);

    return opts[random];
}
