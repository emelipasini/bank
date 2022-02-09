import { MovementType } from "./movement-type.enum";

export class Movement {
    cbu: string;
    amount: number;
    type: MovementType;
    date: Date;

    constructor(cbu: string, amount: number, type: MovementType) {
        this.cbu = cbu;
        this.amount = amount;
        this.type = type;
        this.date = new Date();
    }
}
