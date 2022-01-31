import { Currency } from "../../src/models";

import { randomNumber } from "./functions";

export function createAccount() {
    const random = randomNumber(2);
    const currency = Currency[random];
}
