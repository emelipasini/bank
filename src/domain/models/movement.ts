export class Movement {
    cbu: string;
    amount: number;
    date: Date;

    constructor(cbu: string, amount: number) {
        this.cbu = cbu;
        this.amount = amount;
        this.date = new Date();
    }
}