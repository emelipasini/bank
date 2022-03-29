import { Request, Response } from "express";

import { AccountDB } from "../../database/account";

import { User, Account, Currency } from "../../domain/models";
import { reply } from "../../domain/utils/functions";

export async function transfer(req: Request, res: Response) {
    try {
        const { from, to, amount } = req.query;
        const user = req.query.user as unknown as User;

        //TODO

        const response = reply(200, "Money successfully transferred");
        return res.status(200).json(response);
    } catch (error) {
        const response = reply(500, "Unexpected error", { error });
        return res.status(500).json(response);
    }
}
