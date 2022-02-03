import { ObjectId } from "mongodb";

import { Currency } from "./currency.enum";
import { Movement } from "./movement";

export class Account {
    _id?: ObjectId;
    owner: ObjectId;
    money: number;
    cbu: string;
    currency: Currency;
    movements: Movement[];

    constructor(owner: ObjectId, currency: Currency) {
        this.owner = owner;
        this.money = 0;
        this.cbu = this.generateCBU();
        this.currency = currency;
        this.movements = [];
    }

    private generateCBU(): string {
        let cbu = "00101071";
        for (let i = 0; i < 7; i++) {
            const random = Math.floor(Math.random() * (99 - 10 + 1) + 10);
            cbu += random;
        }
        return cbu;
    }
}
