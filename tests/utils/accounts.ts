import { faker } from "@faker-js/faker";
import { Currency } from "../../src/models";

export function createAccount() {
    const random = randomNumber(2);
    const currency = Currency[random];
}

export function randomNumber(max?: number): number {
    return faker.datatype.number(max);
}
