import { faker } from "@faker-js/faker";
import { User } from "../../src/models";

export function createUser() {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email();
    const password = createPassword();

    const user = new User(firstname, lastname, email, password);
    return user;
}

export function createPassword(): string {
    return faker.random.alphaNumeric(8);
}
