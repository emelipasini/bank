import { Request, Response } from "express";

import { AccountDB } from "../../database/account";

import { User, Account, Currency } from "../../domain/models";
import { reply } from "../../domain/utils/functions";

export async function deposit(req: Request, res: Response) {
    try {
        const { cbu, amount } = req.query;
        const user = req.query.user as unknown as User;

        const account = (await AccountDB.findAccount(cbu as string)) as Account;
        account.money = account.money + Number(amount);

        if (account.owner != user._id) {
            const response = reply(400, "You can only deposit to your own account");
            return res.status(400).json(response);
        }

        if (account.currency !== Currency.ARS) {
            const response = reply(400, "You cannot deposit in a dollar account");
            return res.status(400).json(response);
        }

        await AccountDB.deposit(cbu as string, Number(amount));

        const response = reply(200, "Money successfully deposited");
        return res.status(200).json(response);
    } catch (error) {
        const response = reply(500, "Unexpected error", { error });
        return res.status(500).json(response);
    }
}
