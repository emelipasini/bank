import { ObjectId } from "mongodb";

import { Account, Currency } from "../../src/domain/models";

export function createAccount(userId: ObjectId) {
    const owner = userId;
    const currency = Currency.ARS;

    const account = new Account(owner, currency);

    return account;
}

export function createUSDAccount(userId: ObjectId) {
    const owner = userId;
    const currency = Currency.USD;

    const account = new Account(owner, currency);

    return account;
}
