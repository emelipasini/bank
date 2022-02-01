import { Currency } from "./currency.enum";
import { Movement } from "./movement";

export class Account {
    owner: string;
    money: number;
    cbu: string;
    currency: Currency;
    movements: Movement[];

    constructor(owner: string, currency: Currency) {
        this.owner = owner;
        this.money = 0;
        this.cbu = this.generateCBU();
        this.currency = currency;
        this.movements = [];
    }

    private generateCBU(): string {
        return "";
    }
}
